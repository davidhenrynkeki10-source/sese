import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/store/retail/suits", { waitUntil: "networkidle" });
  await page.screenshot({ path: "suits_current_screen.png" });

  // Emulate print media
  await page.emulateMedia({ media: "print" });
  await page.screenshot({ path: "suits_current_print.png" });

  await browser.close();
}

main().catch(console.error);
