"use client";
// Link to Aksioma Engine (github.com/winaldomanurung/aksioma-engine).
//
// The engine opens drafts in the Studio as  /studio#c=<payload>&o=<draft id>&e=<engine url>.
// The Studio remembers the engine address (`e`) on this device and which draft
// is open (`o`), so "Catat ke engine" can send the edited carousel back to that
// draft. Without a draft id the engine saves it as new content.
// NEXT_PUBLIC_ENGINE_URL (optional) sets the address before any draft was opened.

const URL_KEY = "aksioma-engine-url-v1";
const OUTPUT_KEY = "aksioma-engine-output-v1";

const cleanUrl = (value) => {
  try {
    const u = new URL(String(value || ""));
    return /^https?:$/.test(u.protocol) ? u.origin : null;
  } catch {
    return null;
  }
};

export function readEngineUrl() {
  try {
    return cleanUrl(localStorage.getItem(URL_KEY)) || cleanUrl(process.env.NEXT_PUBLIC_ENGINE_URL);
  } catch {
    return cleanUrl(process.env.NEXT_PUBLIC_ENGINE_URL);
  }
}

// Called when a Studio link is opened. `params` = URLSearchParams of the hash.
export function rememberEngineLink(params) {
  try {
    const url = cleanUrl(params.get("e"));
    if (url) localStorage.setItem(URL_KEY, url);
    const id = Number(params.get("o"));
    if (Number.isInteger(id) && id > 0) localStorage.setItem(OUTPUT_KEY, String(id));
    else localStorage.removeItem(OUTPUT_KEY);
  } catch {
    /* private browsing */
  }
}

export function readEngineOutput() {
  try {
    const id = Number(localStorage.getItem(OUTPUT_KEY));
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

// The editor now holds something else (cleared, example loaded): forget the draft.
export function forgetEngineOutput() {
  try {
    localStorage.removeItem(OUTPUT_KEY);
  } catch {
    /* private browsing */
  }
}

export function engineRecordUrl(engine, payload, outputId) {
  const q = new URLSearchParams({ c: payload });
  if (outputId) q.set("o", String(outputId));
  return `${engine}/catat#${q}`;
}
