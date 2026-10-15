import { toHijri } from "@/lib/hijri";
import { dateKey, getDayTimes, hasTable, HIJRI_MONTHS, TIME_ZONE, type DayTimes } from "./times";

// Расписание на месяц: строки таблицы, начало месяцев хиджры и «просвет дня» для выбора месяца.

export const MONTHS = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];
/** «в октябре» */
export const MONTHS_IN = [
  "январе",
  "феврале",
  "марте",
  "апреле",
  "мае",
  "июне",
  "июле",
  "августе",
  "сентябре",
  "октябре",
  "ноябре",
  "декабре",
];
export const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

export type MonthRow = {
  key: string; // YYYY-MM-DD
  day: number;
  weekday: string;
  friday: boolean;
  monday: boolean;
  times: DayTimes;
  fromTable: boolean;
  /** Первый день месяца хиджры (по расчёту Умм аль-Кура): «1 джумада-ль-ахира 1448». */
  hijriStart: string | null;
};

/** Полдень по Москве — дата не «уезжает» на соседний день ни в каком поясе. */
const noon = (year: number, month: number, day: number) => new Date(Date.UTC(year, month, day, 9));

const daysIn = (year: number, month: number) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

/** Год и месяц (0–11) по Москве. */
export function monthOf(d: Date): { year: number; month: number } {
  const [y, m] = dateKey(d).split("-").map(Number);
  return { year: y, month: m - 1 };
}

export function getMonthRows(year: number, month: number): MonthRow[] {
  return Array.from({ length: daysIn(year, month) }, (_, i) => {
    const date = noon(year, month, i + 1);
    const wd = date.getUTCDay();
    const h = toHijri(date);
    return {
      key: dateKey(date),
      day: i + 1,
      weekday: WEEKDAYS[wd],
      friday: wd === 5,
      monday: wd === 1,
      times: getDayTimes(date),
      fromTable: hasTable(date),
      hijriStart: h.day === 1 ? `1 ${HIJRI_MONTHS[h.month - 1]} ${h.year}` : null,
    };
  });
}

const minutes = (d: Date) => {
  const [h, m] = d.toLocaleTimeString("ru-RU", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" }).split(":");
  return Number(h) * 60 + Number(m);
};

/** Доли суток (0–1) по середине месяца: сумерки фаджр → иша и светлое время восход → магриб. */
export type Daylight = { fajr: number; sunrise: number; maghrib: number; isha: number };

export function getYearDaylight(year: number): Daylight[] {
  return MONTHS.map((_, m) => {
    const t = getDayTimes(noon(year, m, 15));
    const f = (d: Date) => minutes(d) / 1440;
    return { fajr: f(t.fajr), sunrise: f(t.sunrise), maghrib: f(t.maghrib), isha: f(t.isha) };
  });
}

/** Индекс первого дня недели (пн), в которую попадает день `day` (1-based), — для свёрнутого вида на телефоне. */
export function weekStartIndex(rows: MonthRow[], day: number): number {
  let i = Math.min(Math.max(day - 1, 0), rows.length - 1);
  while (i > 0 && !rows[i].monday) i--;
  return i;
}
