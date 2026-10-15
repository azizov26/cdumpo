import { Coordinates, Qibla } from "adhan";

export const KAABA = { lat: 21.4225, lon: 39.8262 };
/** Пенза — город сайта по умолчанию (те же координаты, что и в расчёте времени намаза). */
export const PENZA = { lat: 53.2007, lon: 45.0046 };

const rad = (d: number) => (d * Math.PI) / 180;

/** Направление на Каабу в градусах от севера по часовой стрелке (0–360). */
export const qiblaBearing = (p: { lat: number; lon: number }) => Qibla(new Coordinates(p.lat, p.lon));

/** Расстояние до Каабы по большому кругу, км. */
export function distanceToKaaba(p: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = rad(KAABA.lat - p.lat);
  const dLon = rad(KAABA.lon - p.lon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(p.lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const SIDES = ["север", "северо-восток", "восток", "юго-восток", "юг", "юго-запад", "запад", "северо-запад"];
export const sideName = (deg: number) => SIDES[Math.round((((deg % 360) + 360) % 360) / 45) % 8];

/** Насколько надо повернуться (−180…180): плюс — вправо. */
export const turnNeeded = (heading: number, bearing: number) => ((((bearing - heading) % 360) + 540) % 360) - 180;
