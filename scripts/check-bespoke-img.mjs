import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const filePath = "C:/Users/hp/.gemini/antigravity/brain/3178062b-4c00-470c-81ba-e4d1a2867363/.user_uploaded/media_1791381177655.png";
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

    return {
      imgWidth: width,
      imgHeight: height,
    };
  });

  console.log("Image size:", JSON.stringify(metrics, null, 2));
  await browser.close();
}

main().catch(console.error);
