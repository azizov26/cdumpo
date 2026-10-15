import { CalculationMethod, Coordinates, HighLatitudeRule, Madhab, PrayerTimes } from "adhan";

// Предварительный расчёт до загрузки расписания муфтията.
// Метод и мазхаб не согласованы — сверить с муфтиятом до запуска.
const PENZA = new Coordinates(53.2007, 45.0046);
export const TIME_ZONE = "Europe/Moscow";

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export const PRAYER_NAMES: Record<PrayerKey, string> = {
  fajr: "Фаджр",
  sunrise: "Восход",
  dhuhr: "Зухр",
  asr: "Аср",
  maghrib: "Магриб",
  isha: "Иша",
};

/** Родительный падеж для «до магриба». */
export const PRAYER_NAMES_GEN: Record<PrayerKey, string> = {
  fajr: "фаджра",
  sunrise: "восхода",
  dhuhr: "зухра",
  asr: "асра",
  maghrib: "магриба",
  isha: "иши",
};

export const PRAYER_ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

/** Названия по-арабски — всегда выводятся рядом с русским. */
export const PRAYER_NAMES_AR: Record<PrayerKey, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

/** «До вечерней молитвы» и т. п. */
export const PRAYER_UNTIL: Record<PrayerKey, string> = {
  fajr: "До утренней молитвы",
  sunrise: "До восхода",
  dhuhr: "До полуденной молитвы",
  asr: "До послеполуденной молитвы",
  maghrib: "До вечерней молитвы",
  isha: "До ночной молитвы",
};

export type { SkyState } from "@/lib/sky/geometry";
import type { SkyState } from "@/lib/sky/geometry";
export const SKY_STATES: SkyState[] = ["dawn", "day", "asr", "evening", "night"];
export const SKY_NAMES: Record<SkyState, string> = {
  dawn: "Рассвет",
  day: "День",
  asr: "Золотой час",
  evening: "Закат",
  night: "Ночь",
};

export const isSkyState = (v: unknown): v is SkyState => SKY_STATES.includes(v as SkyState);
/** По пакету дизайнера: светлая тема — только день и золотой час. */
export const themeOf = (s: SkyState) => (s === "day" || s === "asr" ? "light" : "dark");

/** Состояние неба по времени намаза (README пакета дизайнера → «Границы состояний»). */
export function getSkyState(now: Date, t: DayTimes): SkyState {
  const eveningFrom = new Date(t.maghrib.getTime() - 60 * 60_000);
  if (now < t.fajr) return "night";
  if (now < t.sunrise) return "dawn";
  if (now < t.asr) return "day";
  if (now < eveningFrom) return "asr";
  if (now < t.isha) return "evening";
  return "night";
}

export type DayTimes = Record<PrayerKey, Date>;

export function getDayTimes(date: Date): DayTimes {
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.recommended(PENZA);
  const t = new PrayerTimes(PENZA, date, params);
  return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha };
}

/** Ближайший намаз (восход — не намаз, пропускаем). После иши — фаджр завтра. */
export function getNext(now: Date, today: DayTimes): { key: PrayerKey; at: Date } {
  for (const key of PRAYER_ORDER) {
    if (key !== "sunrise" && today[key] > now) return { key, at: today[key] };
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { key: "fajr", at: getDayTimes(tomorrow).fajr };
}

export const formatTime = (d: Date) =>
  d.toLocaleTimeString("ru-RU", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });

export const formatDate = (d: Date) =>
  d.toLocaleDateString("ru-RU", { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long" });

// Названия месяцев хиджры — как в макетах дизайнера.
const HIJRI_MONTHS = [
  "мухаррама", "сафара", "раби-уль-авваля", "раби-ус-сани", "джумада-ль-уля", "джумада-ль-ахира",
  "раджаба", "шаабана", "рамадана", "шавваля", "зуль-када", "зуль-хиджа",
];

export function formatHijri(d: Date) {
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return `${get("day")} ${HIJRI_MONTHS[get("month") - 1]} ${get("year")}`;
}
