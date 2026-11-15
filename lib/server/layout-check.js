// Runs the Studio's own layout measurement ("Periksa sekarang") in a headless
// Chromium against /studio/layout-check#c=<payload> on this deployment.
// On Vercel the browser comes from @sparticuz/chromium; locally Playwright's
// installed Chromium is used (or CHROMIUM_PATH).

const ON_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAYOUT_CHECK_SPARTICUZ);

async function launch() {
  const {chromium} = await import("playwright-core");
  if (ON_SERVERLESS) {
    const {default: serverless} = await import("@sparticuz/chromium");
    return chromium.launch({args: serverless.args, executablePath: await serverless.executablePath(), headless: true});
  }
  return chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, headless: true});
}

const pad = (n) => String(n + 1).padStart(2, "0");

// Merge Instagram and TikTok issues into one list per slide.
function mergeIssues(platforms) {
  const ig = platforms?.instagram || [];
  const tt = platforms?.tiktok || [];
  const out = [];
  const seen = new Set();
  for (const issue of ig) {
    const twin = tt.find((t) => t.index === issue.index && t.severity === issue.severity);
    out.push({...issue, platforms: twin ? ["instagram", "tiktok"] : ["instagram"]});
    seen.add(issue.index + ":" + issue.severity);
  }
  for (const issue of tt) if (!seen.has(issue.index + ":" + issue.severity)) out.push({...issue, platforms: ["tiktok"]});
  return out.sort((a, b) => a.index - b.index).map((i) => ({
    index: i.index,
    slide: pad(i.index),
    severity: i.severity,
    platforms: i.platforms,
    message: i.message.replace(/ di (instagram|tiktok)\./, ".") + (i.platforms.length === 2 ? " [Instagram & TikTok]" : i.platforms[0] === "tiktok" ? " [TikTok]" : " [Instagram]"),
  }));
}

// → {status:"ok", issues:[...]} | {status:"skipped", reason}
export async function checkLayout(origin, payload, {timeoutMs = 40000} = {}) {
  let browser;
  const started = Date.now();
  try {
    browser = await launch();
    const page = await browser.newPage({viewport: {width: 1280, height: 1600}});
    await page.goto(origin + "/studio/layout-check#c=" + payload, {waitUntil: "load", timeout: timeoutMs});
    await page.waitForFunction(() => window.__layout && window.__layout.done, null, {timeout: Math.max(5000, timeoutMs - (Date.now() - started))});
    const result = await page.evaluate(() => window.__layout);
    if (result.error) return {status: "skipped", reason: "Halaman cek layout: " + result.error};
    return {status: "ok", issues: mergeIssues(result.platforms), ms: Date.now() - started};
  } catch (e) {
    return {status: "skipped", reason: "Cek layout tidak berjalan: " + String(e?.message || e).split("\n")[0].slice(0, 200)};
  } finally {
    try { await browser?.close(); } catch { /* already closed */ }
  }
}
