import { dateKey, TIME_ZONE } from "@/lib/prayer/times";

// Ближайшие даты по календарю хиджры (Умм аль-Кура). Начало месяца по наблюдению луны
// может сдвинуться на день, поэтому такие даты помечаются «≈».

type Hijri = { day: number; month: number; year: number };

const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

export function toHijri(d: Date): Hijri {
  const p = fmt.formatToParts(d);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return { day: get("day"), month: get("month"), year: get("year") };
}

const EVENTS: { month: number; day: number; title: string }[] = [
  { month: 1, day: 1, title: "Новый год по хиджре" },
  { month: 3, day: 12, title: "Мавлид ан-Наби" },
  { month: 7, day: 1, title: "Начало месяца раджаб" },
  { month: 7, day: 27, title: "Ночь Мирадж" },
  { month: 8, day: 15, title: "Ночь Бараат" },
  { month: 9, day: 1, title: "Начало Рамадана" },
  { month: 9, day: 27, title: "Ночь Предопределения" },
  { month: 10, day: 1, title: "Ураза-байрам" },
  { month: 12, day: 10, title: "Курбан-байрам" },
];

export type UpcomingDate = { date: Date; title: string; note: string; approx: boolean };

const DAY = 86_400_000;

/** Ближайшая джума и ближайшие памятные даты (до года вперёд). */
export function upcomingDates(now: Date, count = 4): UpcomingDate[] {
  const out: UpcomingDate[] = [];
  const start = new Date(`${dateKey(now)}T12:00:00+03:00`); // полдень сегодняшнего дня по Москве
  let friday: UpcomingDate | null = null;
  for (let i = 0; i < 400 && out.length < count - 1; i++) {
    const d = new Date(start.getTime() + i * DAY);
    const wd = new Intl.DateTimeFormat("en", { timeZone: TIME_ZONE, weekday: "short" }).format(d);
    if (!friday && wd === "Fri") friday = { date: d, title: "Джума-намаз", note: "Пятничная молитва", approx: false };
    const h = toHijri(d);
    const ev = EVENTS.find((e) => e.month === h.month && e.day === h.day);
    if (ev)
      out.push({ date: d, title: ev.title, note: `${h.day} ${HIJRI_MONTHS_GEN[h.month - 1]} ${h.year}`, approx: true });
  }
  return friday ? [friday, ...out] : out;
}

const HIJRI_MONTHS_GEN = [
  "мухаррама",
  "сафара",
  "раби-уль-авваля",
  "раби-ус-сани",
  "джумада-ль-уля",
  "джумада-ль-ахира",
  "раджаба",
  "шаабана",
  "рамадана",
  "шавваля",
  "зуль-када",
  "зуль-хиджа",
];
