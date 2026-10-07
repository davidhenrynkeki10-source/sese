import fs from 'fs';
import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const filePath = "C:/Users/hp/.gemini/antigravity/brain/3178062b-4c00-470c-81ba-e4d1a2867363/.user_uploaded/media_1791381574770.png";
  await page.setContent(`<img id="userimg" src="file://${filePath}" style="display:block;" />`);
  
  const metrics = await page.evaluate(async () => {
    const img = document.getElementById('userimg');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = id;

    // Detect left box (gray ~#a0a0a0) and right box (dark ~#2c2b35)
    let b1 = { minX: width, maxX: 0, minY: height, maxY: 0 };
    let b2 = { minX: width, maxX: 0, minY: height, maxY: 0 };

    for (let y = 100; y < height - 100; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        // If gray (r,g,b around 150-170)
        if (r > 130 && r < 190 && g > 130 && g < 190 && b > 130 && b < 190) {
          if (x < b1.minX) b1.minX = x;
          if (x > b1.maxX) b1.maxX = x;
          if (y < b1.minY) b1.minY = y;
          if (y > b1.maxY) b1.maxY = y;
        }
        // If dark (r < 70, g < 70, b < 70)
        if (r < 70 && g < 70 && b < 70) {
          if (x < b2.minX) b2.minX = x;
          if (x > b2.maxX) b2.maxX = x;
          if (y < b2.minY) b2.minY = y;
          if (y > b2.maxY) b2.maxY = y;
        }
      }
    }

    return {
      width, height,
      b1,
      b2,
      b1LeftPct: b1.minX / width,
      b1WidthPct: (b1.maxX - b1.minX) / width,
      b2LeftPct: b2.minX / width,
      b2WidthPct: (b2.maxX - b2.minX) / width,
      gapBetweenBoxes: b2.minX - b1.maxX,
      aspectRatioBox1: (b1.maxX - b1.minX) / (b1.maxY - b1.minY),
    };
  });

  console.log("Metrics:", JSON.stringify(metrics, null, 2));
  await browser.close();
}

main().catch(console.error);
