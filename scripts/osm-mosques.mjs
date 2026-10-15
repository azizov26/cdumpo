#!/usr/bin/env node
// Черновой список мечетей Пензенской области из открытых данных OpenStreetMap (лицензия ODbL — можно использовать
// с указанием «© участники OpenStreetMap»). Это заготовка для сверки с муфтиятом, а не готовые данные для сайта:
// в OSM у большинства точек нет названий и адресов.
//
// Запуск:  node scripts/osm-mosques.mjs            — скачать точки из Overpass и определить населённые пункты
//          OFFLINE=1 node scripts/osm-mosques.mjs  — взять уже скачанный data/mosques/osm-raw.json
// Результат: data/mosques/osm-draft.json и .csv

import { readFile, writeFile, mkdir } from "node:fs/promises";

const OUT = "data/mosques";
const UA = "cdumpo-site/1.0 (migration research)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const QUERY =
  '[out:json][timeout:150];area["name"="Пензенская область"]["admin_level"="4"]->.a;' +
  '(nwr["amenity"="place_of_worship"]["religion"="muslim"](area.a););out center tags;';
const SERVERS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"];

async function overpass() {
  for (let i = 1; i <= 6; i++) {
    for (const s of SERVERS) {
      try {
        const r = await fetch(s, {
          method: "POST",
          headers: { "user-agent": UA, accept: "application/json" },
          body: new URLSearchParams({ data: QUERY }),
        });
        if (r.ok) return await r.json();
      } catch {}
    }
    await sleep(i * 15000); // серверы Overpass часто перегружены
  }
  throw new Error("Overpass не ответил");
}

// Nominatim: не чаще одного запроса в секунду (правила сервиса).
async function reverse(lat, lon) {
  const u = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=ru&zoom=14&lat=${lat}&lon=${lon}`;
  const r = await fetch(u, { headers: { "user-agent": UA } });
  if (!r.ok) return {};
  const j = await r.json();
  const a = j.address || {};
  return {
    place: a.city || a.town || a.village || a.hamlet || a.suburb || "",
    district: a.county || a.municipality || "",
  };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const raw = process.env.OFFLINE ? JSON.parse(await readFile(`${OUT}/osm-raw.json`, "utf8")) : await overpass();
  if (!process.env.OFFLINE) await writeFile(`${OUT}/osm-raw.json`, JSON.stringify(raw));

  const out = [];
  for (const e of raw.elements) {
    const t = e.tags || {};
    const c = e.center || { lat: e.lat, lon: e.lon };
    const geo = await reverse(c.lat, c.lon);
    await sleep(1100);
    out.push({
      osm: `${e.type}/${e.id}`,
      name: t.name || "",
      place: t["addr:city"] || t["addr:place"] || geo.place || "",
      district: geo.district || "",
      street: [t["addr:street"], t["addr:housenumber"]].filter(Boolean).join(", "),
      lat: Number(c.lat.toFixed(5)),
      lon: Number(c.lon.toFixed(5)),
    });
    process.stdout.write(".");
  }
  out.sort((a, b) => (a.district + a.place).localeCompare(b.district + b.place, "ru"));
  await writeFile(`${OUT}/osm-draft.json`, JSON.stringify(out, null, 2));
  const csv = ["osm;название;населённый пункт;район;адрес;широта;долгота"]
    .concat(out.map((m) => [m.osm, m.name, m.place, m.district, m.street, m.lat, m.lon].join(";")))
    .join("\n");
  await writeFile(`${OUT}/osm-draft.csv`, csv);
  const places = new Set(out.map((m) => m.place).filter(Boolean));
  console.log(`\nТочек: ${out.length}, населённых пунктов: ${places.size}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
