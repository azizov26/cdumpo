// Импорт новостей, видео и фото со старого сайта (data/legacy/news.json) в Payload — этап 7 ROADMAP.
// Запуск (нужна запущенная база):  pnpm payload run scripts/import-legacy.ts
//   LIMIT=5 pnpm payload run scripts/import-legacy.ts   — пробный прогон на первых записях
// Можно запускать повторно: уже импортированные новости (по старому адресу) и файлы пропускаются.
// Файлы берутся из data/legacy/media (их кладёт MEDIA=1 node scripts/scrape-cdumpo.mjs). Текст проходит санитайзер
// и кладётся в поле legacyHtml; картинки заменяются ссылками на загруженные в «Изображения».
import { readFile } from "node:fs/promises";
import path from "node:path";
import config from "@payload-config";
import { getPayload } from "payload";
import { sanitizeLegacyHtml } from "../src/lib/sanitize/legacyHtml";

type Entry = {
  oldUrl: string;
  slug: string;
  kind: "news" | "video" | "photo";
  date: string;
  title: string;
  lead: string;
  cover: string | null;
  html: string;
};

const DIR = "data/legacy";
const RUBRIC = { news: "Муфтият", video: "Видео", photo: "Фото" } as const;
const entries: Entry[] = JSON.parse(await readFile(`${DIR}/news.json`, "utf8"));
const mediaMap: Record<string, string> = JSON.parse(await readFile(`${DIR}/media-map.json`, "utf8"));
const limit = Number(process.env.LIMIT) || entries.length;

const payload = await getPayload({ config });
const uploaded = new Map<string, string>(); // старый адрес файла → новый адрес на сайте

async function upload(url: string, alt: string): Promise<string | null> {
  const known = uploaded.get(url);
  if (known) return known;
  const file = mediaMap[url];
  if (!file) return null;
  const existing = await payload.find({ collection: "media", where: { filename: { equals: file } }, limit: 1 });
  let doc = existing.docs[0];
  if (!doc) {
    try {
      doc = await payload.create({
        collection: "media",
        data: { alt: alt || "Фото" },
        filePath: path.join(DIR, "media", file),
      });
    } catch (e) {
      console.error(`  файл не загружен: ${file}:`, e instanceof Error ? e.message : e);
      return null;
    }
  }
  const href = doc.url ?? null;
  if (href) uploaded.set(url, href);
  return href;
}

/** Картинки старого сайта → наши файлы; то, чего больше нет (старые wp-content), вырезаем вместе с подписью. */
async function rewrite(html: string, title: string): Promise<string> {
  let out = sanitizeLegacyHtml(html);
  const urls = [...new Set([...out.matchAll(/\b(?:src|poster)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]))];
  for (const url of urls) {
    if (
      /\.(?:mp4|mov|webm)(?:\?|$)/i.test(url) ||
      /^https:\/\/(?:rutube\.ru|vk\.com|vkvideo\.ru|www\.youtube-nocookie\.com)\//.test(url)
    )
      continue;
    const isOld = /^https:\/\/(?:fs\.chatium\.ru|cdumpo\.ru)\//.test(url);
    if (!isOld) continue;
    const href = await upload(url, title);
    const esc = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (href) out = out.replace(new RegExp(esc, "g"), href);
    else {
      out = out.replace(new RegExp(`<figure>(?:(?!</figure>)[\\s\\S])*?${esc}[\\s\\S]*?</figure>`, "g"), "");
      out = out.replace(new RegExp(`<img[^>]*${esc}[^>]*>`, "g"), "");
    }
  }
  // Видео-файлы с cdumpo.ru: после отключения старого сайта они пропадут, а CSP не пускает чужие media — убираем.
  out = out.replace(
    /<figure>(?:(?!<\/figure>)[\s\S])*?<video[^>]*src="https?:\/\/(?:www\.)?cdumpo\.ru[^"]*"[\s\S]*?<\/figure>/g,
    "",
  );
  return out.trim();
}

let created = 0;
let skipped = 0;
let failed = 0;
for (const [i, e] of entries.slice(0, limit).entries()) {
  const exists = await payload.find({
    collection: "news",
    where: { oldUrl: { equals: e.oldUrl } },
    limit: 1,
    draft: true,
  });
  if (exists.totalDocs) {
    // Адрес должен совпадать со старым списком редиректов (раньше длинные адреса укорачивались).
    const doc = exists.docs[0];
    if (doc.slug !== e.slug)
      await payload.update({ collection: "news", id: doc.id, data: { slug: e.slug }, draft: false });
    skipped++;
    continue;
  }
  try {
    const cover = e.cover ? await upload(e.cover, e.title) : null;
    const coverDoc = cover
      ? (await payload.find({ collection: "media", where: { url: { equals: cover } }, limit: 1 })).docs[0]
      : undefined;
    await payload.create({
      collection: "news",
      draft: false,
      data: {
        title: e.title,
        lead: e.lead || undefined,
        cover: coverDoc?.id,
        rubric: RUBRIC[e.kind],
        date: e.date,
        slug: e.slug,
        oldUrl: e.oldUrl,
        legacyHtml: await rewrite(e.html, e.title),
        _status: "published",
      },
    });
    created++;
  } catch (err) {
    failed++;
    console.error(`× ${e.slug}:`, err instanceof Error ? err.message : err);
  }
  if ((i + 1) % 20 === 0) console.log(`… ${i + 1} из ${Math.min(limit, entries.length)}`);
}
console.log(`Готово: создано ${created}, пропущено ${skipped}, с ошибкой ${failed}.`);
process.exit(failed ? 1 : 0);
