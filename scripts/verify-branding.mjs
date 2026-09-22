import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "msedge", headless: true });
for (const width of [1440, 768, 390, 320]) {
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const logo = page.locator(".site-header .brand-wordmark");
  await logo.waitFor();
  assert.match(await logo.getAttribute("src"), /sese-navigation-logo\.png/);
  assert.equal(await page.locator(".site-header .wordmark").innerText(), "");
  assert.equal(await logo.evaluate((el) => el.tagName), "IMG");
  assert.equal(
    await page.locator(".site-header .wordmark").getAttribute("href"),
    "/",
  );
  assert.equal(await page.locator(".small-symbol").count(), 0);
  assert.ok(!/^s\.$/im.test(await page.locator("#philosophy").innerText()));
  console.log(
    await page.locator(".site-header .wordmark").evaluate((el) => el.outerHTML),
  );
  assert.equal(await page.locator("#heritage img").count(), 0);
  assert.equal(await page.locator(".heritage-study").count(), 1);
  await page.screenshot({ path: `artifacts/branding-top-${width}.png` });
  await page.locator("#philosophy").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/branding-philosophy-${width}.png` });
  await page.locator("#heritage").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/branding-heritage-${width}.png` });
  assert.ok(
    await page
      .locator(".site-header")
      .evaluate((el) => el.getBoundingClientRect().top === 0),
  );
  const logoBox = await logo.boundingBox();
  assert.ok(logoBox.width > 80 && logoBox.height > 25);
  if (width <= 700) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.locator(".nav-dialog .brand-wordmark").waitFor();
    await page.screenshot({ path: `artifacts/branding-menu-${width}.png` });
    await page.keyboard.press("Escape");
  }
  console.log(
    `Branding ${width}px: asset loaded, header sizing, sticky state, heritage replacement passed.`,
  );
  await page.close();
}
await browser.close();
