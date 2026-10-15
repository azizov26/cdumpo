import type { SkyState } from "@/lib/sky/geometry";

// Источник новостей. Пока админки нет — новостей нет; позже здесь будет запрос к Payload.

export type Rubric = "Муфтият" | "Соборная мечеть" | "Видео" | "Фото";
export const RUBRICS: Rubric[] = ["Муфтият", "Соборная мечеть", "Видео", "Фото"];

export type NewsItem = {
  slug: string;
  rubric: Rubric;
  /** ISO-дата публикации. */
  date: string;
  title: string;
  lead?: string;
  /** Текст новости абзацами; позже — rich text из Payload. */
  body?: string[];
  /** Обложка; пока фото нет — фирменная заглушка-небо. */
  cover?: { src: string; alt: string };
  placeholderSky?: SkyState;
};

export async function getLatestNews(limit?: number): Promise<NewsItem[]> {
  const all: NewsItem[] = [];
  return limit ? all.slice(0, limit) : all;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  return (await getLatestNews()).find((n) => n.slug === slug);
}

export const formatNewsDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Moscow",
  });
