import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
for (const width of [1440, 768, 390, 320]) {
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.locator("h1").waitFor();
  assert.equal(await page.locator("h1").count(), 1);
  const overflow = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll("body *")]
      .filter(
        (el) =>
          el.getBoundingClientRect().right > innerWidth + 1 &&
          getComputedStyle(el).position !== "absolute",
      )
      .map((el) => el.className)
      .slice(0, 10),
  }));
  assert.ok(overflow.document <= width, JSON.stringify(overflow));
  await page.locator(".site-header .brand-wordmark").waitFor();
  await page.waitForFunction(() =>
    [...document.images].every((img) => img.complete && img.naturalWidth > 0),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  assert.equal(
    await page
      .locator("img")
      .evaluateAll(
        (imgs) =>
          imgs.filter((i) => !i.complete || i.naturalWidth === 0).length,
      ),
    0,
  );
  await page.screenshot({
    path: `artifacts/home-${width}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Objects", exact: true }).click();
  assert.equal(await page.locator(".product").count(), 1);
  await page.locator(".product").click();
  await page.locator(".preview-dialog").waitFor({ state: "visible" });
  assert.match(
    await page.locator(".preview-dialog").innerText(),
    /Contour Vessel/,
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".preview-dialog").isVisible(), false);
  await page.getByRole("button", { name: "All pieces", exact: true }).click();
  assert.equal(await page.locator(".product").count(), 3);
  if (width <= 700) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "Search the collection" }).click();
  } else
    await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("searchbox").fill("cloth");
  assert.equal(await page.locator(".search-results button").count(), 1);
  await page.getByRole("button", { name: "Memory Cloth Textiles" }).click();
  assert.match(
    await page.locator(".preview-dialog").innerText(),
    /Memory Cloth/,
  );
  await page.keyboard.press("Escape");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("test@example.com");
  await page
    .getByRole("button", { name: "Subscribe to The Sésé Letter" })
    .click();
  assert.match(
    await page.getByRole("status").innerText(),
    /has not been stored/,
  );
  assert.deepEqual(errors, []);
  results.push({
    width,
    overflow: false,
    errors,
    images: "loaded",
    filters: "pass",
    previews: "pass",
    search: "pass",
    newsletter: "pass",
  });
  await page.close();
}
const motionPage = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
});
await motionPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
await motionPage.waitForTimeout(1600);
assert.equal(
  await motionPage
    .locator(".hero-reveal")
    .first()
    .evaluate((el) => Number(getComputedStyle(el).opacity)),
  1,
);
await motionPage.locator("#journal").scrollIntoViewIfNeeded();
await motionPage.waitForTimeout(1300);
assert.equal(
  await motionPage
    .locator("#journal [data-reveal]")
    .evaluate((el) => Number(getComputedStyle(el).opacity)),
  1,
);
await motionPage.screenshot({ path: "artifacts/motion-journal.png" });
console.log(JSON.stringify({ results, motion: "pass" }, null, 2));
await browser.close();
