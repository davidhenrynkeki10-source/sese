import fs from "node:fs/promises";
import sharp from "sharp";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";

// The supplied PNG supplies every letter pixel: no fonts or redrawn paths.
// Retain its RGB/shading, isolate the backdrop with alpha, and export the exact
// 420 × 180 source viewport through the browser's SVG renderer.
const source = await fs.readFile("public/images/sese-logo.png");
const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="180" viewBox="220 970 420 180"><defs><filter id="isolate" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 6 0 0 -0.035"/></filter></defs><image width="853" height="1280" href="data:image/png;base64,${source.toString("base64")}" filter="url(#isolate)"/></svg>`;
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 420, height: 180 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${artwork}</body></html>`,
    { waitUntil: "networkidle" },
  );
  await page
    .locator("svg")
    .screenshot({
      path: "public/images/sese-navigation-logo.png",
      omitBackground: true,
    });
} finally {
  await browser.close();
}
const stats = await sharp("public/images/sese-navigation-logo.png").stats();
assert.ok(
  stats.channels[3].max > 200,
  "The exported logo must have visible ink.",
);
assert.equal(stats.channels[3].min, 0, "The background must be transparent.");
assert.ok(
  stats.channels[3].mean > 10 && stats.channels[3].mean < 120,
  "Check cropped lettering coverage.",
);
console.log(
  "Exported original source artwork: 420 × 180 transparent PNG; visible ink verified.",
);
