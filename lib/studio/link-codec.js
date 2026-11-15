// Carousel link format, shared by the Studio (browser), /api/check (server) and
// the Claude skill (Python):
//
//   payload = base64url( deflate-raw( UTF-8 JSON ) )   — no padding
//   Studio link: /studio#c=<payload>
//
// The payload sits after "#", so opening a Studio link never sends the carousel
// to the server. Python equivalent:
//   z = zlib.compressobj(9, zlib.DEFLATED, -15)
//   raw = z.compress(json.encode("utf-8")) + z.flush()
//   payload = base64.urlsafe_b64encode(raw).decode().rstrip("=")

export const LINK_PARAM = "c";
// /api/check receives the payload in the query string; keep it well below the
// ~14 KB request-line limit of common hosts. Studio links (hash) have no such limit.
export const CHECK_MAX_PAYLOAD = 12000;

export function bytesToBase64Url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlToBytes(text) {
  const clean = String(text || "").trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*$/.test(clean)) throw new Error("Payload link rusak: ada karakter di luar base64url.");
  const bin = atob(clean + "===".slice((clean.length + 3) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Reads `c=` from a hash ("#c=...") or query string ("?c=...").
export function payloadFrom(fragment) {
  const text = String(fragment || "").replace(/^[#?]/, "");
  return new URLSearchParams(text).get(LINK_PARAM);
}

async function streamThrough(bytes, stream) {
  const piped = new Blob([bytes]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(piped).arrayBuffer());
}

// Browser: payload → JSON text.
export async function decodePayload(payload) {
  if (typeof DecompressionStream === "undefined") throw new Error("Browser ini belum mendukung link carousel. Perbarui browser atau paste JSON secara manual.");
  const raw = base64UrlToBytes(payload);
  try {
    return new TextDecoder().decode(await streamThrough(raw, new DecompressionStream("deflate-raw")));
  } catch {
    throw new Error("Payload link tidak bisa dibuka (bukan deflate-raw yang utuh). Minta Claude membuat link ulang.");
  }
}

// Browser: JSON text → payload.
export async function encodePayload(jsonText) {
  if (typeof CompressionStream === "undefined") throw new Error("Browser ini belum mendukung link carousel.");
  return bytesToBase64Url(await streamThrough(new TextEncoder().encode(jsonText), new CompressionStream("deflate-raw")));
}
