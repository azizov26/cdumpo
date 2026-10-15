import { cacheLife, cacheTag } from "next/cache";
import { sql } from "@payloadcms/db-postgres";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { News, Media } from "@/payload-types";
import { getCms } from "@/lib/cms/payload";
import type { Rubric } from "@/lib/content/rubrics";
import type { SkyState } from "@/lib/sky/geometry";

import { RUBRICS } from "@/lib/content/rubrics";
export { RUBRICS };
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
  /** Текст перенесённой новости (HTML со старого сайта); на сайте показывается только после санитайзера. */
  legacyHtml?: string;
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
    legacyHtml: withBody ? (doc.legacyHtml ?? undefined) : undefined,
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

export type NewsPage = { items: NewsItem[]; total: number };

/** Порция ленты «Жизни уммы»: по рубрике (или все) и со смещением. Ленту листают с сервера, а не грузят целиком. */
export async function getNewsPage(rubric: Rubric | null, offset: number, limit: number): Promise<NewsPage> {
  "use cache";
  cacheTag("news");
  cacheLife("hours");
  return safely("лента новостей", { items: [], total: 0 }, async () => {
    const cms = await getCms();
    const { docs, totalDocs } = await cms.find({
      collection: "news",
      where: rubric
        ? { and: [{ _status: { equals: "published" } }, { rubric: { equals: rubric } }] }
        : { _status: { equals: "published" } },
      sort: "-date",
      limit,
      page: Math.floor(offset / limit) + 1,
      depth: 1,
    });
    return { items: docs.map((d) => toItem(d)), total: totalDocs };
  });
}

/** Рубрики, в которых есть опубликованные новости (для кнопок-фильтров). */
export async function getNewsRubrics(): Promise<Rubric[]> {
  "use cache";
  cacheTag("news");
  cacheLife("hours");
  return safely("рубрики новостей", [], async () => {
    const cms = await getCms();
    const present = await Promise.all(
      RUBRICS.map(async (r) => {
        const { totalDocs } = await cms.count({
          collection: "news",
          where: { and: [{ _status: { equals: "published" } }, { rubric: { equals: r } }] },
        });
        return totalDocs > 0 ? r : null;
      }),
    );
    return present.filter((r): r is Rubric => r !== null);
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

/** Поиск по новостям: полнотекстовый поиск Postgres (русская морфология) по заголовку, лиду и тексту перенесённых новостей. */
export async function searchNews(query: string, limit = 30): Promise<NewsItem[]> {
  const q = query.trim().slice(0, 100);
  if (q.length < 2) return [];
  const cms = await getCms();
  const { rows } = await cms.db.drizzle.execute<{ id: number }>(sql`
    WITH doc AS (
      SELECT id, date,
        to_tsvector('russian',
          coalesce(title, '') || ' ' || coalesce(lead, '') || ' ' ||
          regexp_replace(coalesce(legacy_html, ''), '<[^>]+>', ' ', 'g')) AS tsv
      FROM news
      WHERE _status = 'published'
    )
    SELECT id FROM doc
    WHERE tsv @@ websearch_to_tsquery('russian', ${q})
    ORDER BY ts_rank(tsv, websearch_to_tsquery('russian', ${q})) DESC, date DESC
    LIMIT ${limit}
  `);
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return [];
  const { docs } = await cms.find({
    collection: "news",
    where: { id: { in: ids } },
    limit: ids.length,
    depth: 1,
    pagination: false,
  });
  const byId = new Map(docs.map((d) => [d.id, d]));
  return ids.flatMap((id) => (byId.get(id) ? [toItem(byId.get(id)!)] : []));
}
