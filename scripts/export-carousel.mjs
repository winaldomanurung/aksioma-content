import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const positionalArgs = args.filter((arg) => !arg.startsWith("--"));
const routeArg = positionalArgs[0] || "/carousel/demo";
const positionalPlatformArg = positionalArgs[1];
const baseUrlArg = args.find((arg) => arg.startsWith("--base-url="));
const qualityArg = args.find((arg) => arg.startsWith("--quality="));
const platformArg = args.find((arg) => arg.startsWith("--platform="));

const route = routeArg.startsWith("/") ? routeArg : "/" + routeArg;
const baseUrl = (baseUrlArg ? baseUrlArg.split("=")[1] : "http://127.0.0.1:3000").replace(/\/$/, "");
const quality = Number(qualityArg ? qualityArg.split("=")[1] : 95);

// npm/PowerShell can consume --platform=... as an npm config option instead
// of forwarding it to the script. Support all common paths deliberately.
const cliPlatform = platformArg ? platformArg.split("=")[1] : null;
const npmPlatform = process.env.npm_config_platform || process.env.NPM_CONFIG_PLATFORM || null;
const rawPlatform = cliPlatform || positionalPlatformArg || npmPlatform || "instagram";
const requestedPlatform = String(rawPlatform).toLowerCase();

const platforms = {
  instagram: { width: 1080, height: 1350 },
  tiktok: { width: 1080, height: 1350 },
};

if (!["instagram", "tiktok", "all"].includes(requestedPlatform)) {
  throw new Error(
    'Platform "' + rawPlatform + '" tidak dikenali. Gunakan instagram, tiktok, atau all.'
  );
}

if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
  throw new Error("--quality harus berupa angka 1 sampai 100.");
}

const cleanRoute = route.split("?")[0];
const slug = cleanRoute.split("/").filter(Boolean).pop() || "carousel";
const targets = requestedPlatform === "all"
  ? ["instagram", "tiktok"]
  : [requestedPlatform];

console.log("CLI args:", args.join(" ") || "(none)");
console.log("Resolved platform:", requestedPlatform);

const browser = await chromium.launch();

async function exportPlatform(platform) {
  const expected = platforms[platform];
  const outputDir = path.join(process.cwd(), "output", slug, platform);

  await fs.mkdir(outputDir, { recursive: true });

  const page = await browser.newPage({
    viewport: {
      width: Math.max(1280, expected.width + 200),
      height: Math.max(1500, expected.height + 200),
    },
    deviceScaleFactor: 1,
  });

  try {
    const url = new URL(cleanRoute, baseUrl);
    url.searchParams.set("platform", platform);
    url.searchParams.delete("safe");

    console.log("\nOpening " + url.toString());
    console.log("Requested platform: " + platform);

    await page.goto(url.toString(), { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const stage = page.locator(".carousel-stage").first();

    if ((await stage.count()) === 0) {
      throw new Error("Tidak menemukan .carousel-stage.");
    }

    // Force the export mode directly on the rendered DOM as a second layer of
    // protection. This makes export deterministic even if route/query parsing changes.
    await stage.evaluate((element, value) => {
      element.dataset.platform = value;
      element.dataset.safeArea = "false";
    }, platform);

    await page.evaluate(() => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));

    const renderedPlatform = await stage.getAttribute("data-platform");

    if (renderedPlatform !== platform) {
      throw new Error(
        "Platform render mismatch: requested " + platform +
        ", tetapi DOM membaca " + renderedPlatform + "."
      );
    }

    const slides = page.locator("[data-carousel-slide]");
    const count = await slides.count();

    if (count === 0) {
      throw new Error(
        "Tidak menemukan [data-carousel-slide]. Pastikan halaman memakai CarouselCanvas."
      );
    }

    const firstBox = await slides.first().boundingBox();

    if (!firstBox) {
      throw new Error("Tidak bisa membaca ukuran slide pertama.");
    }

    console.log(
      "Rendered canvas: " +
      Math.round(firstBox.width) + "x" + Math.round(firstBox.height)
    );

    for (let index = 0; index < count; index += 1) {
      const slide = slides.nth(index);
      const box = await slide.boundingBox();

      if (!box) {
        throw new Error("Slide " + (index + 1) + " tidak memiliki bounding box.");
      }

      const width = Math.round(box.width);
      const height = Math.round(box.height);

      if (width !== expected.width || height !== expected.height) {
        throw new Error(
          "Slide " + (index + 1) + " berukuran " + width + "x" + height +
          "; expected " + expected.width + "x" + expected.height +
          " untuk " + platform + "."
        );
      }

      const filename = String(index + 1).padStart(2, "0") + ".jpg";
      const destination = path.join(outputDir, filename);

      await slide.screenshot({
        path: destination,
        type: "jpeg",
        quality,
        animations: "disabled",
      });

      console.log("✓ " + platform + "/" + filename + " (" + width + "x" + height + ")");
    }

    console.log("Done: " + count + " slide → " + outputDir);
  } finally {
    await page.close();
  }
}

try {
  for (const platform of targets) {
    await exportPlatform(platform);
  }
} finally {
  await browser.close();
}
