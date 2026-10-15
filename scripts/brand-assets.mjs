// Иконки сайта и картинка для превью ссылок: node scripts/brand-assets.mjs
// → src/app/icon.png (512), src/app/apple-icon.png (180), public/og.png (1200×630).
// Знак ЦДУМ ПО берётся из public/brand/logo.png без изменений; небо — цвета «заката» из токенов.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
// setContent живёт на about:blank, file:// оттуда не читается — встраиваем ресурсы как data-URI.
const url = (p) => {
  const mime = p.endsWith(".png") ? "image/png" : "font/woff2";
  return `data:${mime};base64,${readFileSync(resolve(root, p)).toString("base64")}`;
};
const logo = url("public/brand/logo.png");
const cormorant = url(
  "node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-cyrillic-wght-normal.woff2",
);
const cormorantIt = url(
  "node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-cyrillic-wght-italic.woff2",
);
const manrope = url("node_modules/@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2");

const fonts = `
@font-face{font-family:C;src:url(${cormorant});font-weight:300 700}
@font-face{font-family:C;src:url(${cormorantIt});font-weight:300 700;font-style:italic}
@font-face{font-family:M;src:url(${manrope});font-weight:200 800}`;

const icon = (size) => `<style>html,body{margin:0;background:transparent}
.i{width:${size}px;height:${size}px;border-radius:50%;background:#fff;display:grid;place-items:center}
.i img{width:${size * 0.8}px}</style><div class="i"><img src="${logo}"></div>`;

const og = `<style>${fonts}
html,body{margin:0}
.p{width:1200px;height:630px;position:relative;overflow:hidden;color:#fff8ec;font-family:M;
background:linear-gradient(180deg,#131d44 0%,#3d2d5e 38%,#86707e 68%,#c4725c 100%)}
.st{position:absolute;border-radius:50%;background:#fff6e4}
.c{position:absolute;left:0;right:0;bottom:0}
.t{position:absolute;left:84px;top:96px}
.badge{width:96px;height:96px;border-radius:50%;background:#fff;display:grid;place-items:center}
.badge img{width:78px}
h1{font:italic 500 112px/1 C;margin:44px 0 0;color:#fbebd2;letter-spacing:-.01em}
h1 b{font-style:normal;font-weight:500}
p{margin:26px 0 0;font:500 26px/1.35 M;color:rgba(247,241,230,.86);max-width:720px}
</style><div class="p">
${[
  [120, 60, 3],
  [260, 130, 2],
  [420, 40, 2],
  [610, 90, 3],
  [760, 150, 2],
  [900, 60, 3],
  [1040, 120, 2],
  [1120, 40, 2],
  [980, 210, 2],
  [330, 220, 2],
  [700, 230, 2],
]
  .map(([x, y, r]) => `<i class="st" style="left:${x}px;top:${y}px;width:${r}px;height:${r}px;opacity:.8"></i>`)
  .join("")}
<svg class="c" viewBox="0 0 1200 190" width="1200" height="190" fill="#0c1128"><rect x="0" y="150" width="1200" height="40"/><path d="M690 150v-46a70 70 0 0 1 140 0v46z"/><rect x="620" y="150" width="70" height="0"/><rect x="866" y="40" width="12" height="110"/><path d="M860 40l12-34 12 34z"/><rect x="640" y="60" width="12" height="90"/><path d="M634 60l12-34 12 34z"/><rect x="940" y="112" width="120" height="38"/><rect x="300" y="122" width="150" height="28"/><rect x="480" y="132" width="90" height="18"/><path d="M752 36v-10M752 26l-5 5h10z"/></svg>
<div class="t"><div class="badge"><img src="${logo}"></div>
<h1><b>ЦДУМ</b> ПО</h1>
<p>Централизованное духовное управление мусульман Пензенской области</p></div></div>`;

const b = await chromium.launch();
async function shot(html, w, h, path, transparent = false) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: resolve(root, path), omitBackground: transparent });
  await p.close();
}
await shot(icon(512), 512, 512, "src/app/icon.png", true);
await shot(
  icon(180).replace("border-radius:50%;background:#fff", "border-radius:0;background:#fff"),
  180,
  180,
  "src/app/apple-icon.png",
);
await shot(og, 1200, 630, "public/og.png");
await b.close();
console.log("ok");
