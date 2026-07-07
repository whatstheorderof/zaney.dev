import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

// `clip` crops a square region for icon-friendly art on light/busy pages.
const games = [
  { slug: "zaney-games", url: "https://zaneygames.vercel.app/", clip: { x: 0, y: 0, width: 800, height: 800 } },
  { slug: "zaney-sudoku", url: "https://www.zaneysudoku.com/" },
  { slug: "zaney-tarot", url: "https://www.zaneytarot.com/" },
  { slug: "zaney-links", url: "https://zaneylinks.vercel.app/" },
  { slug: "zaney-cube", url: "https://zaneycube.vercel.app/" },
  { slug: "zaney-word", url: "https://zaneyword.vercel.app/" },
  { slug: "say-more", url: "https://saymoregame.com/" },
  { slug: "zaney-tales", url: "https://zaneytales.com/" },
  { slug: "zaney-search", url: "https://zaneysearch.vercel.app/", clip: { x: 0, y: 0, width: 800, height: 800 } },
  { slug: "zaney-logic", url: "https://zaneylogic.vercel.app/", clip: { x: 40, y: 0, width: 780, height: 780 } },
  { slug: "saz-skyroads", url: "https://sazskyroads.vercel.app/" },
  { slug: "grive-image-host", url: "https://griveimagehost.vercel.app/", clip: { x: 120, y: 30, width: 740, height: 740 } },
  { slug: "zaney-kakuro", url: "https://zaneykakuro.vercel.app/" },
  { slug: "zaney-aquarium", url: "https://zaneyaquarium.vercel.app/", clip: { x: 480, y: 20, width: 460, height: 460 } },
  { slug: "witch-please", url: "https://witchplease.vercel.app/", clip: { x: 90, y: 60, width: 620, height: 620 } },
  { slug: "zaney-strands", url: "https://zaneystrands.vercel.app/", clip: { x: 330, y: 85, width: 540, height: 540 } },
];

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "screenshots");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

for (const game of games) {
  const dest = path.join(outDir, `${game.slug}.png`);
  console.log(`Capturing ${game.url} -> ${dest}`);
  try {
    await page.goto(game.url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1000);
    const skipButton = page.getByRole("button", { name: /^skip$/i });
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      await page.waitForTimeout(300);
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await page.screenshot({ path: dest, clip: game.clip });
  } catch (err) {
    console.error(`Failed to capture ${game.url}:`, err.message);
  }
}

await browser.close();
console.log("Done.");
