import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const routeArg = args.find((arg) => !arg.startsWith("--")) || "/carousel/demo";
const baseUrlArg = args.find((arg) => arg.startsWith("--base-url="));
const qualityArg = args.find((arg) => arg.startsWith("--quality="));

const route = routeArg.startsWith("/") ? routeArg : "/" + routeArg;
const baseUrl = (baseUrlArg ? baseUrlArg.split("=")[1] : "http://127.0.0.1:3000").replace(/\/$/, "");
const quality = Number(qualityArg ? qualityArg.split("=")[1] : 95);

if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
  throw new Error("--quality harus berupa angka 1 sampai 100.");
}

const slug = route.split("?")[0].split("/").filter(Boolean).pop() || "carousel";
const outputDir = path.join(process.cwd(), "output", slug);

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 1500 },
  deviceScaleFactor: 1,
});

try {
  const url = baseUrl + route;
  console.log("Opening " + url);

  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const slides = page.locator("[data-carousel-slide]");
  const count = await slides.count();

  if (count === 0) {
    throw new Error("Tidak menemukan [data-carousel-slide]. Pastikan halaman memakai CarouselCanvas.");
  }

  for (let index = 0; index < count; index += 1) {
    const slide = slides.nth(index);
    const box = await slide.boundingBox();

    if (!box) {
      throw new Error("Slide " + (index + 1) + " tidak memiliki bounding box.");
    }

    const width = Math.round(box.width);
    const height = Math.round(box.height);

    if (width !== 1080 || height !== 1350) {
      throw new Error(
        "Slide " + (index + 1) + " berukuran " + width + "x" + height +
        "; expected 1080x1350. Export dibatalkan agar hasil tidak berbeda dari canvas standar."
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

    console.log("✓ " + filename);
  }

  console.log("\nDone. " + count + " slide tersimpan di " + outputDir);
} finally {
  await browser.close();
}
