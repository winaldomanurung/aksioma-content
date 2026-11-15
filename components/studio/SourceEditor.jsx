"use client";

import {useEffect, useRef} from "react";
import {Annotation, EditorState, StateEffect, StateField} from "@codemirror/state";
import {
  Decoration, EditorView, WidgetType, drawSelection, highlightActiveLine, highlightActiveLineGutter,
  keymap, lineNumbers, placeholder as placeholderExt,
} from "@codemirror/view";
import {defaultKeymap, history, historyKeymap} from "@codemirror/commands";
import {json} from "@codemirror/lang-json";
import {
  HighlightStyle, bracketMatching, foldEffect, foldGutter, foldKeymap, foldedRanges, indentOnInput,
  syntaxHighlighting, unfoldAll, unfoldEffect,
} from "@codemirror/language";
import {lintGutter, lintKeymap, setDiagnostics} from "@codemirror/lint";
import {highlightSelectionMatches, searchKeymap} from "@codemirror/search";
import {tags as t} from "@lezer/highlight";
import {slideOutline} from "@/lib/studio/source-edit";

// Carousel Source editor (CodeMirror 6): JSON highlighting, line numbers,
// folding, a header + colour band per slide, lint underlines for validation
// problems, and a hover highlight driven by the preview's text mode.
//
// Props: value, onChange(text), highlight {start,end}|null, diagnostics
// {forDoc, items:[{from,to,message,slide}]}, onCursorSlide(index), apiRef
// (filled with {reveal(from,to), revealSlide(i), foldSlides(), unfoldSlides()}).

const External = Annotation.define();

// ---- Slide structure ------------------------------------------------------
const setSlideErrors = StateEffect.define();

function outlineOf(state) {
  return slideOutline(state.doc.toString());
}

const slidesField = StateField.define({
  create: (state) => ({slides: outlineOf(state), errors: {}}),
  update(value, tr) {
    let {slides, errors} = value;
    let touched = false;
    for (const e of tr.effects) {
      if (e.is(setSlideErrors)) errors = e.value;
      if (e.is(foldEffect) || e.is(unfoldEffect)) touched = true; // redraw ▸/▾
    }
    if (tr.docChanged) {
      const fresh = outlineOf(tr.state);
      // Mid-edit the JSON may be broken after some point: keep the slides the
      // scanner could not reach, mapped through the edit.
      const rest = slides.slice(fresh.length).map((s) => ({...s, start: tr.changes.mapPos(s.start, 1), end: tr.changes.mapPos(s.end, -1)}))
        .filter((s) => s.end > s.start && (!fresh.length || s.start >= fresh[fresh.length - 1].end));
      slides = [...fresh, ...rest];
    }
    return slides === value.slides && errors === value.errors && !touched ? value : {slides, errors};
  },
});

class SlideHeader extends WidgetType {
  constructor(slide, errors, folded) {
    super();
    this.slide = slide;
    this.errors = errors;
    this.folded = folded;
  }
  eq(other) {
    return other.slide.index === this.slide.index && other.slide.type === this.slide.type && other.slide.title === this.slide.title &&
      other.errors === this.errors && other.folded === this.folded;
  }
  toDOM(view) {
    const el = document.createElement("div");
    el.className = "cm-slideHeader" + (this.errors ? " cm-slideHeader-error" : "");
    el.dataset.slideHeader = String(this.slide.index);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.title = this.folded ? "Buka slide ini" : "Lipat slide ini";
    btn.textContent = (this.folded ? "▸ " : "▾ ") + "SLIDE " + String(this.slide.index + 1).padStart(2, "0");
    btn.addEventListener("mousedown", (e) => e.preventDefault());
    btn.addEventListener("click", () => toggleSlide(view, this.slide.index));
    el.appendChild(btn);
    const meta = document.createElement("span");
    meta.className = "cm-slideHeader-meta";
    meta.textContent = [this.slide.type || "?", this.slide.title].filter(Boolean).join(" · ");
    el.appendChild(meta);
    if (this.errors) {
      const badge = document.createElement("span");
      badge.className = "cm-slideHeader-badge";
      badge.textContent = "⚠ " + this.errors;
      el.appendChild(badge);
    }
    return el;
  }
  ignoreEvent() {
    return true;
  }
}

function slideFoldRange(slide) {
  return {from: slide.start + 1, to: slide.end - 1};
}
function isFolded(state, slide) {
  const r = slideFoldRange(slide);
  let found = false;
  foldedRanges(state).between(r.from, r.to, (from, to) => {
    if (from === r.from && to === r.to) found = true;
  });
  return found;
}
function toggleSlide(view, index) {
  const slide = view.state.field(slidesField).slides[index];
  if (!slide || slide.end - slide.start < 3) return;
  const r = slideFoldRange(slide);
  view.dispatch({effects: isFolded(view.state, slide) ? unfoldEffect.of(r) : foldEffect.of(r)});
}

const slideDecorations = EditorView.decorations.compute([slidesField, "doc"], (state) => {
  const {slides, errors} = state.field(slidesField);
  const doc = state.doc;
  const ranges = [];
  for (const s of slides) {
    if (s.start >= doc.length) continue;
    const first = doc.lineAt(s.start);
    const last = doc.lineAt(Math.min(s.end, doc.length));
    ranges.push(Decoration.widget({widget: new SlideHeader(s, errors[s.index] || 0, isFolded(state, s)), block: true, side: -1}).range(first.from));
    const band = Decoration.line({class: "cm-slideBand cm-slideBand-" + (s.index % 2 ? "b" : "a")});
    for (let n = first.number; n <= last.number; n++) ranges.push(band.range(doc.line(n).from));
  }
  return Decoration.set(ranges, true);
});

// ---- Hover highlight (preview text mode) ----------------------------------
const setHover = StateEffect.define();
const hoverMark = Decoration.mark({class: "cm-hoverHighlight", attributes: {"data-source-highlight": "true"}});
const hoverField = StateField.define({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) if (e.is(setHover)) deco = e.value ? Decoration.set([hoverMark.range(e.value.from, e.value.to)]) : Decoration.none;
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// ---- Look ------------------------------------------------------------------
const highlightStyle = HighlightStyle.define([
  {tag: t.propertyName, color: "#7dd3fc"},
  {tag: t.string, color: "#fcd34d"},
  {tag: t.number, color: "#f0abfc"},
  {tag: [t.bool, t.null], color: "#fb7185"},
  {tag: [t.brace, t.squareBracket, t.separator, t.punctuation], color: "#a1a1aa"},
]);

const theme = EditorView.theme({
  "&": {height: "100%", backgroundColor: "#09090b", color: "#e4e4e7", fontSize: "12px", borderRadius: "12px"},
  "&.cm-focused": {outline: "1px solid #f87171"},
  ".cm-scroller": {fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", lineHeight: "20px", overflow: "auto"},
  ".cm-content": {caretColor: "#fafafa", padding: "6px 0"},
  ".cm-cursor, .cm-dropCursor": {borderLeftColor: "#fafafa"},
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {backgroundColor: "rgba(96,165,250,.35) !important"},
  ".cm-gutters": {backgroundColor: "#09090b", color: "#a1a1aa", border: "none", borderRadius: "12px 0 0 12px"},
  ".cm-activeLine": {backgroundColor: "rgba(255,255,255,.04)"},
  ".cm-activeLineGutter": {backgroundColor: "rgba(255,255,255,.06)", color: "#d4d4d8"},
  ".cm-foldGutter .cm-gutterElement": {cursor: "pointer", color: "#a1a1aa"},
  ".cm-foldPlaceholder": {backgroundColor: "#27272a", border: "1px solid #3f3f46", color: "#a1a1aa", padding: "0 6px", borderRadius: "6px"},
  ".cm-slideBand": {borderLeft: "3px solid transparent"},
  ".cm-slideBand-a": {borderLeftColor: "#f87171", backgroundColor: "rgba(248,113,113,.035)"},
  ".cm-slideBand-b": {borderLeftColor: "#60a5fa", backgroundColor: "rgba(96,165,250,.035)"},
  ".cm-slideHeader": {display: "flex", alignItems: "center", gap: "8px", margin: "6px 6px 2px 0", padding: "3px 8px", borderRadius: "8px",
    backgroundColor: "#18181b", border: "1px solid #27272a", fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: "11px", lineHeight: "18px", color: "#a1a1aa", minWidth: "0"},
  ".cm-slideHeader button": {font: "inherit", fontWeight: "800", letterSpacing: ".06em", color: "#fafafa", background: "none", border: "none", padding: "0", cursor: "pointer", flex: "none"},
  ".cm-slideHeader-meta": {overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: "0", flex: "1"},
  ".cm-slideHeader-badge": {flex: "none", fontWeight: "800", color: "#fecaca", backgroundColor: "#7f1d1d", borderRadius: "999px", padding: "0 8px"},
  ".cm-slideHeader-error": {borderColor: "#991b1b"},
  ".cm-hoverHighlight": {backgroundColor: "rgba(252,211,77,.45)", borderRadius: "2px"},
  ".cm-lintRange-error": {backgroundImage: "none", textDecoration: "underline wavy #f87171", textUnderlineOffset: "3px", backgroundColor: "rgba(248,113,113,.18)"},
  ".cm-tooltip": {backgroundColor: "#18181b", color: "#fafafa", border: "1px solid #3f3f46", borderRadius: "8px"},
  ".cm-diagnostic-error": {borderLeftColor: "#f87171"},
  ".cm-panels": {backgroundColor: "#18181b", color: "#fafafa"},
  ".cm-placeholder": {color: "#a1a1aa"},
}, {dark: true});

// ---- Component ---------------------------------------------------------------
export default function SourceEditor({id, value, onChange, highlight, diagnostics, onCursorSlide, apiRef, placeholder, className = ""}) {
  const host = useRef(null);
  const view = useRef(null);
  const handlers = useRef({onChange, onCursorSlide});
  useEffect(() => { handlers.current = {onChange, onCursorSlide}; }, [onChange, onCursorSlide]);

  useEffect(() => {
    let lastSlide = -1;
    const listener = EditorView.updateListener.of((u) => {
      if (u.docChanged && !u.transactions.some((tr) => tr.annotation(External))) handlers.current.onChange?.(u.state.doc.toString());
      if (u.selectionSet || u.docChanged) {
        const head = u.state.selection.main.head;
        const slide = u.state.field(slidesField).slides.find((s) => head >= s.start && head <= s.end);
        const index = slide ? slide.index : -1;
        if (index !== lastSlide) {
          lastSlide = index;
          if (index >= 0 && u.selectionSet && u.view.hasFocus) handlers.current.onCursorSlide?.(index);
        }
      }
    });
    const v = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(), foldGutter(), lintGutter(), highlightActiveLineGutter(), highlightActiveLine(),
          history(), drawSelection(), indentOnInput(), bracketMatching(), highlightSelectionMatches(),
          json(), syntaxHighlighting(highlightStyle), EditorView.lineWrapping,
          keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap, ...searchKeymap, ...lintKeymap]),
          slidesField, slideDecorations, hoverField, theme, listener,
          placeholder ? placeholderExt(placeholder) : [],
          EditorView.contentAttributes.of({"aria-label": "Carousel source", spellcheck: "false", autocorrect: "off", autocapitalize: "off", ...(id ? {id} : {})}),
        ],
      }),
    });
    view.current = v;
    return () => { v.destroy(); view.current = null; };
    // The editor is created once; later prop changes are pushed in below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Text changed outside the editor (visual edits, Load contoh, Hapus konten).
  useEffect(() => {
    const v = view.current;
    if (!v || v.state.doc.toString() === value) return;
    v.dispatch({changes: {from: 0, to: v.state.doc.length, insert: value}, annotations: External});
  }, [value]);

  // Validation problems → underlines, gutter markers and per-slide badges.
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const fresh = diagnostics && diagnostics.forDoc === v.state.doc.toString();
    const items = fresh ? diagnostics.items : [];
    const len = v.state.doc.length;
    const diags = items.map((d) => {
      const from = Math.max(0, Math.min(d.from, len));
      return {from, to: Math.max(from, Math.min(d.to, len)), severity: "error", message: d.message, source: d.label};
    });
    const errors = {};
    for (const d of items) if (d.slide !== null && d.slide !== undefined) errors[d.slide] = (errors[d.slide] || 0) + 1;
    const spec = setDiagnostics(v.state, diags);
    const lintEffects = Array.isArray(spec.effects) ? spec.effects : spec.effects ? [spec.effects] : [];
    v.dispatch({effects: [...lintEffects, setSlideErrors.of(errors)]});
  }, [diagnostics]);

  // Hover highlight from the preview.
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const len = v.state.doc.length;
    const range = highlight && highlight.start < highlight.end && highlight.end <= len ? {from: highlight.start, to: highlight.end} : null;
    const effects = [setHover.of(range)];
    if (range) effects.push(EditorView.scrollIntoView(range.from, {y: "nearest", yMargin: 48}));
    v.dispatch({effects});
  }, [highlight]);

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      reveal(from, to = from) {
        const v = view.current;
        if (!v) return;
        const len = v.state.doc.length;
        const a = Math.max(0, Math.min(from, len)), b = Math.max(a, Math.min(to, len));
        const effects = [EditorView.scrollIntoView(a, {y: "center"})];
        // Open any fold hiding the target.
        foldedRanges(v.state).between(a, b, (f, tt) => { effects.push(unfoldEffect.of({from: f, to: tt})); });
        v.dispatch({selection: {anchor: a, head: b}, effects});
        v.focus();
      },
      revealSlide(index) {
        const v = view.current;
        const slide = v?.state.field(slidesField).slides[index];
        if (!slide) return;
        const effects = [EditorView.scrollIntoView(slide.start, {y: "start", yMargin: 8})];
        if (isFolded(v.state, slide)) effects.push(unfoldEffect.of(slideFoldRange(slide)));
        v.dispatch({selection: {anchor: slide.start}, effects});
        v.focus();
      },
      foldSlides() {
        const v = view.current;
        if (!v) return;
        const effects = v.state.field(slidesField).slides.filter((s) => s.end - s.start > 2 && !isFolded(v.state, s)).map((s) => foldEffect.of(slideFoldRange(s)));
        if (effects.length) v.dispatch({effects});
      },
      unfoldSlides() {
        if (view.current) unfoldAll(view.current);
      },
    };
  }, [apiRef]);

  return <div ref={host} data-source-editor="true" className={"mt-2 overflow-hidden rounded-xl border border-black/15 bg-zinc-950 " + className} />;
}
