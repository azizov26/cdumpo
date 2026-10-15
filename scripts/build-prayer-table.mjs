#!/usr/bin/env node
// Сборка компактной таблицы намазов для сайта из выгрузки scrape-namaz.mjs.
// Запуск: node scripts/build-prayer-table.mjs [data/prayer-times/dumpo-2026.json]
// Результат: src/data/prayer-times.json — { city, source, days: { "2026-10-15": "04:54 06:26 12:15 14:28 17:04 18:39" } }
import { readFile, writeFile } from "node:fs/promises";

const input = process.argv[2] || "data/prayer-times/dumpo-2026.json";
const src = JSON.parse(await readFile(input, "utf8"));
const KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
const TIME = /^\d{2}:\d{2}$/;

const days = {};
let skipped = 0;
for (const r of src.rows.filter((r) => r.city === "Пенза")) {
  const t = KEYS.map((k) => r[k]);
  if (!t.every((v) => TIME.test(v))) {
    skipped++;
    continue;
  }
  days[r.date] = t.join(" ");
}
const out = { city: "Пенза", timeZone: "Europe/Moscow", source: src.source, fetchedAt: src.fetchedAt, days };
await writeFile("src/data/prayer-times.json", JSON.stringify(out) + "\n");
console.log(`Готово: ${Object.keys(days).length} дней → src/data/prayer-times.json (пропущено строк: ${skipped})`);
