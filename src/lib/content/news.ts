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
  /** Обложка; пока фото нет — фирменная заглушка-небо. */
  cover?: { src: string; alt: string };
  placeholderSky?: SkyState;
};

export async function getLatestNews(limit = 5): Promise<NewsItem[]> {
  void limit;
  return [];
}
