// Иконки для установки на экран: node scripts/pwa-icons.mjs → public/icons/*.png
// Знак берётся из public/brand/logo.png без изменений: обычная иконка — на белом круге, maskable — на ночном фоне с запасом по краям.
import sharp from "sharp";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const logo = resolve(root, "public/brand/logo.png");
const out = (n) => resolve(root, "public/icons", n);

async function round(size) {
  const mark = await sharp(logo)
    .resize(Math.round(size * 0.8), Math.round(size * 0.8), { fit: "inside" })
    .toBuffer();
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  return sharp(circle)
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
}

async function maskable(size) {
  // Безопасная зона maskable — центральный круг 80 %: знак занимает 55 % стороны.
  const mark = await sharp(logo)
    .resize(Math.round(size * 0.55), Math.round(size * 0.55), { fit: "inside" })
    .toBuffer();
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#0b1636"/><circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.36}" fill="#fff"/></svg>`,
  );
  return sharp(bg)
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
}

for (const s of [192, 512]) {
  await sharp(await round(s)).toFile(out(`icon-${s}.png`));
  await sharp(await maskable(s)).toFile(out(`icon-maskable-${s}.png`));
}
console.log("ok");
