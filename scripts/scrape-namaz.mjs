#!/usr/bin/env node
// Выгрузка расписания намазов со старого сайта dumpo.ru в JSON и CSV.
// Запуск из корня проекта:  node scripts/scrape-namaz.mjs
// Результат: data/prayer-times/dumpo-<год>.json и .csv
//
// ВАЖНО: сайт dumpo.ru взломан. Скрипт только скачивает HTML обычным HTTP-запросом
// и разбирает таблицу текстом — ничего со страницы не выполняется.
// Не открывайте этот сайт через Playwright или в браузере ради выгрузки.

import { mkdir, writeFile, readFile } from "node:fs/promises";

const YEAR = Number(process.env.YEAR || new Date().getFullYear());
const BASE = "http://dumpo.ru/namaz";
const CITIES = {
  1: "Пенза",
};
const WD = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
const KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
const TIMEOUT_MS = Number(process.env.TIMEOUT || 15000);
const ONLY = process.env.ONLY; // например ONLY=1:10 — только Пенза, октябрь (для проверки)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s) =>
  s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function parseTable(html) {
  const t = html.match(/<table id="namaztime">([\s\S]*?)<\/table>/i);
  if (!t) return null;
  const rows = [...t[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) => m[1]);
  const head = [...rows[0].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => strip(m[1]));
  const hijriMonths = head[2] || "";
  const days = rows
    .slice(1)
    .map((r) => {
      const c = [...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => strip(m[1]));
      if (c.length < 9) return null;
      const o = { day: Number(c[0]), weekday: c[1], hijriDay: Number(c[2]) };
      KEYS.forEach((k, i) => (o[k] = c[3 + i]));
      return o;
    })
    .filter(Boolean);
  return { hijriMonths, days };
}

async function main() {
  const out = [];
  const warnings = [];
  for (const [cid, city] of Object.entries(CITIES)) {
    for (let m = 1; m <= 12; m++) {
      if (ONLY) {
        const [oc, om] = ONLY.split(":").map(Number);
        if (oc !== Number(cid) || (om && om !== m)) continue;
      }
      const url = `${BASE}?c=${cid}&m=${m}`;
      process.stdout.write(`… ${city}, месяц ${m}: загружаю ${url}\n`);
      let html = null;
      for (let attempt = 1; attempt <= 3 && html === null; attempt++) {
        try {
          const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (cdumpo-migration)" },
            redirect: "manual",
            signal: AbortSignal.timeout(TIMEOUT_MS),
          });
          if (res.status >= 300 && res.status < 400) {
            throw new Error(`редирект на ${res.headers.get("location")} — возможно, следствие взлома, пропускаю`);
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          html = await res.text();
        } catch (e) {
          const msg = e.name === "TimeoutError" ? `нет ответа за ${TIMEOUT_MS / 1000} с` : e.message;
          process.stdout.write(`   ✗ попытка ${attempt}: ${msg}\n`);
          if (attempt === 3) warnings.push(`${city} ${m}: ${msg}`);
          else await sleep(1500);
        }
      }
      if (html === null) continue;
      const t = parseTable(html);
      if (!t || !t.days.length) {
        warnings.push(`${city} ${m}: таблица не найдена`);
        continue;
      }
      for (const d of t.days) {
        const date = new Date(Date.UTC(YEAR, m - 1, d.day));
        if (WD[date.getUTCDay()] !== d.weekday)
          warnings.push(`${city} ${m}/${d.day}: день недели «${d.weekday}» не совпадает с ${YEAR} годом`);
        out.push({
          cityId: Number(cid),
          city,
          date: date.toISOString().slice(0, 10),
          hijriMonths: t.hijriMonths,
          ...d,
        });
      }
      // повторяющиеся подряд строки — признак ошибки в исходной таблице
      for (let i = 1; i < t.days.length; i++) {
        if (KEYS.every((k) => t.days[i][k] === t.days[i - 1][k]))
          warnings.push(`${city} ${m}/${t.days[i].day}: время полностью совпадает с предыдущим днём`);
      }
      process.stdout.write(`✓ ${city}, месяц ${m}: ${t.days.length} дн.\n`);
      await sleep(400);
    }
  }
  await mkdir("data/prayer-times", { recursive: true });
  const base = `data/prayer-times/dumpo-${YEAR}`;
  await writeFile(
    `${base}.json`,
    JSON.stringify({ source: BASE, year: YEAR, fetchedAt: new Date().toISOString(), rows: out }, null, 2),
  );
  const csv = [
    "city,date,weekday,hijriDay,fajr,sunrise,dhuhr,asr,maghrib,isha",
    ...out.map((r) => [r.city, r.date, r.weekday, r.hijriDay, ...KEYS.map((k) => r[k])].join(",")),
  ].join("\n");
  await writeFile(`${base}.csv`, csv);
  await writeFile(`${base}-warnings.txt`, warnings.join("\n"));
  console.log(
    `\nГотово: ${out.length} строк → ${base}.json / .csv. Замечаний: ${warnings.length} (см. ${base}-warnings.txt)`,
  );
}

// Проверка разбора на сохранённой странице: node scripts/scrape-namaz.mjs --test page.html
if (process.argv[2] === "--test") {
  const t = parseTable(await readFile(process.argv[3], "utf8"));
  console.log(t.hijriMonths, t.days.length, t.days[12]);
} else {
  await main();
}
