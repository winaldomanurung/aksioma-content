import {makeAiPrompt,STYLE_PRESETS} from "@/lib/studio/ai-guide";
import {CONTENT_PRESETS} from "@/lib/studio/presets";
import {FONT_PRESETS} from "@/lib/studio/fonts";
import {LOOK_PRESETS} from "@/lib/studio/looks";
import {ACCOUNTS,accountOf} from "@/lib/studio/accounts";

// The Studio AI prompt as plain text, generated from the same constants as the
// "Salin prompt" button, so a Claude skill never works from a stale copy.
//   GET /api/prompt?account=trader&delivery=link&preset=bebas&style=seimbang&slides=auto&look=classic&font=aksioma&topic=...&extra=...
//   GET /api/prompt?options=1   → available values (JSON)

export const dynamic = "force-dynamic";

const pick = (value, table, fallback) => (value && Object.prototype.hasOwnProperty.call(table, value) ? value : fallback);
const label = (table) => Object.fromEntries(Object.entries(table).map(([id, v]) => [id, v.label + (v.summary ? " — " + v.summary : "")]));

export function GET(request) {
  const q = request.nextUrl.searchParams;
  const origin = request.nextUrl.origin;
  if (q.get("options")) {
    return Response.json({
      delivery: {paste: "Jawab dengan code block JSON untuk ditempel ke /studio", link: "Validasi ke /api/check lalu kirim link Studio (untuk Claude)"},
      account: Object.fromEntries(Object.values(ACCOUNTS).map((a) => [a.id, a.name + " — " + a.summary])),
      preset: label(CONTENT_PRESETS),
      style: label(STYLE_PRESETS),
      look: label(LOOK_PRESETS),
      font: label(FONT_PRESETS),
      slides: "auto atau angka 5–20",
      examples: [origin + "/api/prompt?delivery=link", origin + "/api/prompt?delivery=link&preset=perbandingan", origin + "/api/prompt?delivery=link&preset=scorecard&style=data"],
    }, {headers: {"Cache-Control": "no-store"}});
  }
  const slidesRaw = q.get("slides");
  const n = Number(slidesRaw);
  const prompt = makeAiPrompt({
    topic: (q.get("topic") || "").slice(0, 2000) || "Materi dari percakapan saat ini: pertanyaan pengguna, jawaban yang sudah dibahas, serta artikel/laporan/data yang ditempel pengguna. Angka HANYA dari materi itu.",
    audience: q.get("audience") || undefined,
    objective: q.get("objective") || undefined,
    slides: Number.isInteger(n) && n >= 5 && n <= 20 ? String(n) : "auto",
    style: pick(q.get("style"), STYLE_PRESETS, "seimbang"),
    preset: pick(q.get("preset"), CONTENT_PRESETS, "bebas"),
    look: pick(q.get("look"), LOOK_PRESETS, undefined),
    font: pick(q.get("font"), FONT_PRESETS, undefined),
    extra: (q.get("extra") || "").slice(0, 1500),
    account: accountOf(q.get("account")),
    delivery: q.get("delivery") === "link" ? "link" : "paste",
    origin,
  });
  return new Response(prompt + "\n", {headers: {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store"}});
}
