// Первый экран во всех состояниях неба: node scripts/sky-shots.mjs [папка] [ширины через запятую]
import { chromium } from "playwright";
const out = process.argv[2] || "screens";
const widths = (process.argv[3] || "390,1440").split(",").map(Number);
const skies = ["dawn", "day", "asr", "evening", "night"];
const browser = await chromium.launch();
for (const w of widths) {
  for (const sky of skies) {
    const page = await browser.newPage({ viewport: { width: w, height: w < 768 ? 844 : 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(`http://localhost:3000/?sky=${sky}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/sky-${sky}-${w}.png` });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(sky, w, overflow > 0 ? `СКРОЛЛ +${overflow}` : "ok", errors.length ? errors.slice(0, 2).join(" | ") : "");
    await page.close();
  }
}
await browser.close();
