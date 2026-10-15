import { cacheLife, cacheTag } from "next/cache";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { News, Media } from "@/payload-types";
import { getCms } from "@/lib/cms/payload";
import type { Rubric } from "@/lib/content/rubrics";
import type { SkyState } from "@/lib/sky/geometry";

export { RUBRICS } from "@/lib/content/rubrics";
export type { Rubric } from "@/lib/content/rubrics";

export type NewsItem = {
  slug: string;
  rubric: Rubric;
  /** ISO-дата публикации. */
  date: string;
  title: string;
  lead?: string;
  /** Текст новости — rich text из админки. */
  body?: SerializedEditorState;
  /** Обложка; пока фото нет — фирменная заглушка-небо. */
  cover?: { src: string; alt: string };
  placeholderSky?: SkyState;
};

const isMedia = (v: unknown): v is Media => typeof v === "object" && v !== null && "url" in v;

function toItem(doc: News, withBody = false): NewsItem {
  const cover = isMedia(doc.cover) && doc.cover.url ? doc.cover : undefined;
  return {
    slug: doc.slug ?? String(doc.id),
    rubric: doc.rubric as Rubric,
    date: doc.date,
    title: doc.title,
    lead: doc.lead ?? undefined,
    // Текст нужен только на странице новости; в ленте он лишний вес.
    body: withBody ? ((doc.body as SerializedEditorState | null) ?? undefined) : undefined,
    cover: cover && { src: cover.sizes?.wide?.url ?? cover.url!, alt: cover.alt },
  };
}

// Если база недоступна, сайт не падает, а показывает пустое состояние; такой ответ кэшируется ненадолго.
async function safely<T>(what: string, fallback: T, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (e) {
    console.error(`[cms] ${what}:`, e instanceof Error ? e.message : e);
    cacheLife({ stale: 0, revalidate: 10, expire: 60 });
    return fallback;
  }
}

export async function getLatestNews(limit?: number): Promise<NewsItem[]> {
  "use cache";
  cacheTag("news");
  cacheLife("hours");
  return safely("новости", [], async () => {
    const cms = await getCms();
    const { docs } = await cms.find({
      collection: "news",
      where: { _status: { equals: "published" } },
      sort: "-date",
      limit: limit ?? 200,
      depth: 1,
      pagination: false,
    });
    return docs.map((d) => toItem(d));
  });
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  "use cache";
  cacheTag("news");
  cacheLife("hours");
  return safely("новость", undefined, async () => {
    const cms = await getCms();
    const { docs } = await cms.find({
      collection: "news",
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
      limit: 1,
      depth: 1,
    });
    return docs[0] ? toItem(docs[0], true) : undefined;
  });
}

export const formatNewsDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Moscow",
  });
