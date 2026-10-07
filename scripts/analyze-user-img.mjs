import fs from 'fs';
import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Let's load the user image in a page to measure it
  const filePath = "C:/Users/hp/.gemini/antigravity/brain/3178062b-4c00-470c-81ba-e4d1a2867363/.user_uploaded/media_1791378019541.png";
  await page.setContent(`<img id="userimg" src="file://${filePath}" style="display:block;" />`);
  
  // Use canvas to find non-white bounding box of the two suit images in media_1791378019541.png
  const metrics = await page.evaluate(async () => {
    const img = document.getElementById('userimg');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = id;

    // Find bounding box of the suit images (non-white, non-gray text)
    // Suit image has dark colors (e.g. blue suit, yellow background)
    let minX = width, maxX = 0, minY = height, maxY = 0;
    for (let y = 50; y < height - 50; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        // If not white background
        if (r < 240 || g < 240 || b < 240) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return {
      imgWidth: width,
      imgHeight: height,
      suitsBox: { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY },
      leftMarginPct: minX / width,
      widthPct: (maxX - minX) / width,
      topMarginPct: minY / height,
      heightPct: (maxY - minY) / height,
    };
  });

  console.log("User image metrics:", JSON.stringify(metrics, null, 2));
  await browser.close();
}

main().catch(console.error);
