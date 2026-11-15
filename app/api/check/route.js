import zlib from "node:zlib";
import {checkCarouselText} from "@/lib/studio/carousel-check";
import {CHECK_MAX_PAYLOAD,bytesToBase64Url} from "@/lib/studio/link-codec";
import {checkLayout} from "@/lib/server/layout-check";

// Validates a carousel exactly like the Studio: the Render validator, the fit
// and number warnings, and (unless layout=0) the real layout measurement of
// "Periksa sekarang" for Instagram and TikTok in a headless Chromium.
//   POST /api/check[?layout=0]  body: carousel JSON (or {"payload":"<base64url>"})  → JSON
//   GET  /api/check?c=<base64url deflate-raw JSON>[&layout=0]                     → plain text
// Used by the jadikan-carousel-stock Claude skill (see §9 of /api/prompt?delivery=link).
//
// ok = valid JSON/schema AND no slide that is cut off or has colliding text.
// Slides that are too empty or auto-shrunk come back as "layout" issues with
// severity "empty"/"tight": they do not block, but should be fixed.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_JSON_BYTES = 240000;
const CORS = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"};

function inflate(payload) {
  const clean = String(payload || "").trim().replace(/\s+/g, "");
  if (!clean) throw new Error("Parameter c kosong.");
  if (!/^[A-Za-z0-9_-]+$/.test(clean)) throw new Error("Payload c bukan base64url (hanya A–Z a–z 0–9 - _, tanpa padding =).");
  try {
    return zlib.inflateRawSync(Buffer.from(clean, "base64url"), {maxOutputLength: MAX_JSON_BYTES}).toString("utf8");
  } catch {
    throw new Error("Payload c tidak bisa dibuka. Pakai deflate-raw (zlib.compressobj(9, zlib.DEFLATED, -15)) lalu base64url tanpa '='.");
  }
}

const payloadOf = (json) => bytesToBase64Url(zlib.deflateRawSync(Buffer.from(json, "utf8"), {level: 9}));

async function result(origin, text, withLayout) {
  const r = checkCarouselText(text);
  const out = {ok: r.ok, errors: r.errors, warnings: r.warnings, slides: r.slides, title: r.title};
  if (!r.ok) return out;
  const payload = payloadOf(r.json);
  out.link = origin + "/studio#c=" + payload;
  if (!withLayout) {
    out.layout = {status: "skipped", reason: "layout=0"};
    return out;
  }
  const layout = await checkLayout(origin, payload);
  out.layout = layout;
  if (layout.status === "ok") {
    const blocking = layout.issues.filter((i) => i.severity === "overflow");
    out.errors = blocking.map((i) => i.message);
    out.layoutIssues = layout.issues.filter((i) => i.severity !== "overflow").map((i) => i.message);
    out.ok = blocking.length === 0;
  }
  return out;
}

function asText(r) {
  const lines = ["STATUS: " + (r.ok ? "OK" : "GAGAL")];
  if (r.title) lines.push("JUDUL: " + r.title, "JUMLAH SLIDE: " + r.slides);
  if (r.errors?.length) lines.push("", "MASALAH (wajib diperbaiki, " + r.errors.length + "):", ...r.errors.map((e) => "- " + e));
  if (r.layoutIssues?.length) lines.push("", "LAYOUT (perbaiki bila bisa, " + r.layoutIssues.length + "):", ...r.layoutIssues.map((e) => "- " + e));
  if (r.warnings?.length) lines.push("", "PERINGATAN (tidak memblokir, " + r.warnings.length + "):", ...r.warnings.map((w) => "- " + w));
  if (r.layout?.status === "skipped" && r.layout.reason !== "layout=0") lines.push("", "CEK LAYOUT DILEWATI: " + r.layout.reason);
  if (r.link) lines.push("", "LINK STUDIO (kirim utuh ke pengguna):", r.link);
  return lines.join("\n") + "\n";
}

const origin = (request) => request.nextUrl.origin;
const layoutOn = (request) => request.nextUrl.searchParams.get("layout") !== "0";

export function OPTIONS() {
  return new Response(null, {status: 204, headers: CORS});
}

export async function GET(request) {
  const c = request.nextUrl.searchParams.get("c");
  let body;
  if (!c) {
    body = asText({ok: false, errors: ["Kirim carousel: POST JSON ke /api/check, atau GET /api/check?c=<base64url deflate-raw JSON>."]});
  } else if (c.length > CHECK_MAX_PAYLOAD) {
    body = asText({ok: false, errors: ["Payload " + c.length + " karakter terlalu panjang untuk GET (maks " + CHECK_MAX_PAYLOAD + "). Pakai POST, atau kurangi slide/teks."]});
  } else {
    try { body = asText(await result(origin(request), inflate(c), layoutOn(request))); }
    catch (e) { body = asText({ok: false, errors: [e.message]}); }
  }
  return new Response(body, {headers: {...CORS, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store"}});
}

export async function POST(request) {
  const json = (data, status = 200) => Response.json(data, {status, headers: {...CORS, "Cache-Control": "no-store"}});
  const raw = await request.text();
  if (raw.length > MAX_JSON_BYTES) return json({ok: false, errors: ["Body terlalu besar (maks " + MAX_JSON_BYTES + " karakter)."], warnings: []}, 413);
  let text = raw;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.payload === "string" && !parsed.slides) text = inflate(parsed.payload);
  } catch (e) {
    if (e instanceof Error && /^Payload|^Parameter/.test(e.message)) return json({ok: false, errors: [e.message], warnings: []});
    // Not JSON: let the Studio parser report where it breaks.
  }
  return json(await result(origin(request), text, layoutOn(request)));
}
