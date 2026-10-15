// Скриншоты страниц на контрольных ширинах: node scripts/screens.mjs [путь] [папка]
import { chromium } from "playwright";
const path = process.argv[2] || "/";
const out = process.argv[3] || "screens";
const widths = [360, 768, 1280, 1440];
const browser = await chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${process.env.PORT || 3000}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const name = `${out}/${path.replace(/\W+/g, "_") || "home"}-${w}.png`;
  await page.screenshot({ path: name, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, overflow > 0 ? `ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ +${overflow}px` : "ok");
  await page.close();
}
await browser.close();
