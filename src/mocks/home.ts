// Демо-данные для макетов. Темы — из PRODUCT.md; заголовки, даты и тексты условные
// и заменяются контентом из Payload. Фактов об организации здесь не добавлять.
import type { SkyState } from "@/lib/sky/geometry";

export type Rubric = "Муфтият" | "Соборная мечеть" | "Видео" | "Фото" | "Дети";

/** Фильтр «Жизни уммы» — как в эталоне. */
export const RUBRICS: Rubric[] = ["Муфтият", "Соборная мечеть", "Видео", "Фото"];

export type NewsItem = {
  slug: string;
  rubric: Rubric;
  date: string;
  title: string;
  lead?: string;
  sky: SkyState;
};

export const news: NewsItem[] = [
  {
    slug: "konkurs-dlya-detey",
    rubric: "Дети",
    date: "14 октября",
    title: "Региональный конкурс рисунков и поделок для детей",
    lead: "Приглашаем юных участников из Пензы и области. Рассказываем, как подать работу и когда подведут итоги.",
    sky: "dawn",
  },
  {
    slug: "muftiy-sabantuy",
    rubric: "Видео",
    date: "8 октября",
    title: "Муфтий Асият-хазрат Уразаев на Сабантуе",
    sky: "evening",
  },
  {
    slug: "subbotnik-sobornaya-mechet",
    rubric: "Соборная мечеть",
    date: "4 октября",
    title: "Субботник на площадке строительства Соборной мечети",
    sky: "asr",
  },
  {
    slug: "rodnik-v-penze",
    rubric: "Фото",
    date: "2 октября",
    title: "Родник в Пензе: строительство помещения для источника",
    sky: "night",
  },
  {
    slug: "obshchestvennaya-palata",
    rubric: "Муфтият",
    date: "25 сентября",
    title: "Муфтий на заседании Общественной палаты",
    sky: "day",
  },
];

/** Ближайшие даты. Даты по хиджре — расчёт по календарю Умм аль-Кура, поэтому «≈». */
export const upcomingDates = [
  { day: "16", approx: false, month: "октября · пятница", title: "Джума-намаз", note: "Пятничная молитва в мечетях области" },
  { day: "10", approx: true, month: "декабря", title: "Начало раджаба", note: "1 раджаба 1448" },
  { day: "9", approx: true, month: "января", title: "Начало шаабана", note: "1 шаабана 1448" },
  { day: "8", approx: true, month: "февраля", title: "Рамадан", note: "1 рамадана 1448", highlight: true },
];

/** Цифры созвездия — пример с макета концепции, не реальные данные сбора. */
export const cathedralExample = { lit: 74, percent: 62 };
