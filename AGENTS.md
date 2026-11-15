<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aksioma Content rules

This repo is the single carousel studio for both Aksioma accounts. It was merged from `stock-analysis` (the base; its version wins on any conflict) and the old `aksioma-content`.

- Two accounts, defined once in `lib/studio/accounts.js` (pure data, safe on the server): `trader` (finance, stocks) and `journey` (general topics). `meta.account` decides a carousel's account; without it the carousel follows the active account in the navigation (`lib/studio/account-store.js`, localStorage).
- Never hardcode `"trader"` in a client screen: read `useAccount()`. Finance-only pages (presets, Laporan Pasar, Impor Saham) stay Trader and are marked `only:"trader"` in `components/studio/SiteNav.jsx`, which also feeds the home page.
- Account differences live in three places only: `AccountBookend.jsx` (cover/CTA copy and classes), `decorationNodes` in `StudioSlide.jsx` (Journey auto-decorates content slides, Trader stays plain), and `makeAiPrompt` in `ai-guide.js` (guide, language rules, example). Brand Kit is stored per account (`lib/studio/brand.js`).
- `/api/prompt` and `/api/check` are a contract used by `aksioma-engine`; keep their parameters and response shape backward compatible (`account` defaults to `trader`).
- Studio UI (not slides): icons come from `components/studio/Icon.jsx`, never Unicode glyphs; no kicker label above page headings; touch targets at least 44px; white text only on `red-600` or darker. On phones the Studio shows one pane at a time (`studio-pane`, `studio-tabs`, `studio-actionbar` in `globals.css`); do not use the `hidden` attribute for panes (Tailwind's layered rule cannot be overridden).


- Treat JSX/React as the source of truth. JPEG files are generated artifacts and must not be hand-edited.
- Standard Instagram carousel canvas is exactly 1080 × 1350 CSS pixels.
- Every exportable slide must render through `CarouselCanvas` and keep the `data-carousel-slide` attribute.
- Preview and export must use the same DOM and component styles.
- Generated files belong in `output/` and must stay gitignored.
- Prefer reusable slide components in `components/carousel/` over duplicated markup.
- Keep each content route self-contained under `app/carousel/<slug>/page.jsx`.
- Avoid runtime randomness, time-dependent rendering, animations, or delayed layout shifts inside exportable slides.
- Fonts must be loaded before screenshots are taken.
- Decorative elements may overflow internally, but `CarouselCanvas` itself must remain fixed and `overflow-hidden`.
- Use semantic content props where practical so AI-generated content can be swapped without rewriting the design system.


## AI carousel authoring rules

- `app/carousel/demo/page.jsx` is the canonical portable AI specification. Keep its AI AUTHORING CONTRACT accurate whenever components change.
- A pasted `page.jsx` should be sufficient context for another AI to create a complete replacement page without needing README access.
- Preset slides are shortcuts, not mandatory templates.
- Prefer `FreeformSlide` + primitives whenever presets make the information feel forced or repetitive.
- Choose visual structure from information semantics:
  - contrast -> CompareSlide or Freeform split composition
  - cause/effect -> CauseEffectSlide or DiagramNode + Connector
  - sequence/process -> FrameworkSlide or Timeline
  - quantitative insight -> BigNumber / StatCard
  - practical actions -> Checklist / Callout
  - quote or mental model -> QuoteCard
- Do not use identical card-grid compositions for more than two consecutive slides.
- Vary density intentionally across a carousel.
- Use connectors only when they communicate an actual relationship.
- Important text must remain in normal layout flow so Instagram/TikTok adaptations stay safe.
- When adding a new reusable primitive, export it from `components/carousel/index.js` and document it in the AI contract.
- Enum values and hard character limits live in constants (`schema.js` `SCHEMA_RULES`/`FIXED`, `market.js`, `stock.js`, `component-specs.js`). The AI prompt's §3 KONTRAK FIELD is generated from them by `lib/studio/prompt-contract.js`; never hand-type a limit or enum into prompt text.
- Validator messages must start with a location (`Slide 08.nodes[1]: field ...` or `meta: field ...`) so the Studio can map them to the source; use `soft()` for problems that do not change the data shape so all problems are reported at once.
