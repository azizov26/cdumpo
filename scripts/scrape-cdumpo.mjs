#!/usr/bin/env node
// Выгрузка новостей, видео и фото со старого сайта cdumpo.ru (Chatium) — этап 7 ROADMAP.
// Запуск из корня проекта:  node scripts/scrape-cdumpo.mjs            (JSON + редиректы)
//                           MEDIA=1 node scripts/scrape-cdumpo.mjs    (+ скачать файлы с fs.chatium.ru)
// Результат:
//   data/legacy/news.json       — все записи: старый id/URL, новый slug, рубрика, чистый заголовок, HTML, медиа
//   data/legacy/redirects.json  — таблица 301: старый адрес → новый
//   data/legacy/media/          — скачанные файлы (в git не попадают)
//
// Источник — публичный JSON-эндпоинт старого сайта, тот же, что дёргает его главная страница.
// Ничего со страниц не выполняется: только HTTP GET и разбор текста.

import { mkdir, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ORIGIN = 'https://cdumpo.ru';
const OUT = 'data/legacy';
const MEDIA_DIR = path.join(OUT, 'media');
const WITH_MEDIA = process.env.MEDIA === '1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const RUBRIC = { Новости: 'news', Видео: 'video', Фото: 'photo', 'Без рубрики': 'news' };

// Эмодзи и знаки-украшения в начале и по тексту заголовка (требование ROADMAP: без эмодзи в заголовках).
export function cleanTitle(t) {
  return t
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}️‍]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// «ВЕРХНИЙ РЕГИСТР» → обычный, если заголовок целиком капсом.
export function fixCaps(t) {
  const letters = t.replace(/[^А-Яа-яЁёA-Za-z]/g, '');
  if (letters.length > 6 && letters === letters.toUpperCase()) {
    const s = t.toLowerCase();
    return (s.charAt(0).toUpperCase() + s.slice(1)).replace(/«([а-яё])/g, (_, c) => `«${c.toUpperCase()}`);
  }
  return t;
}

const TR = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
export function slugify(t, max = 70) {
  const s = t
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => TR[c] ?? '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s.slice(0, max).replace(/-+$/g, '');
}

const strip = (h) =>
  h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

export function extractMedia(html, cover) {
  const images = new Set();
  const videos = new Set();
  const embeds = new Set();
  const links = new Set();
  for (const m of (html || '').matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) images.add(m[1]);
  for (const m of (html || '').matchAll(/<video[^>]+src=["']([^"']+)["']/gi)) videos.add(m[1]);
  for (const m of (html || '').matchAll(/<source[^>]+src=["']([^"']+)["']/gi)) videos.add(m[1]);
  for (const m of (html || '').matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)) embeds.add(m[1]);
  for (const m of (html || '').matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) links.add(m[1]);
  if (cover) images.add(cover);
  return { images: [...images], videos: [...videos], embeds: [...embeds], links: [...links] };
}

// В поле image иногда лежит только имя файла без хоста.
const absMedia = (u) => (u && !/^https?:|^\/\//.test(u) ? `https://fs.chatium.ru/get/${u}` : u);

async function getJson(url, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (cdumpo-migration)' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i === tries) throw e;
      await sleep(1000 * i);
    }
  }
}

const fileName = (url) => {
  const u = new URL(url);
  const base = path.basename(u.pathname) || 'file';
  const h = createHash('sha1').update(url).digest('hex').slice(0, 6);
  return `${h}-${base}`.slice(0, 120);
};

async function download(url, dest) {
  try {
    await access(dest);
    return 'cached';
  } catch {}
  for (let i = 1; i <= 3; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await writeFile(dest, Buffer.from(await r.arrayBuffer()));
      return 'ok';
    } catch (e) {
      if (i === 3) return `fail: ${e.message}`;
      await sleep(800 * i);
    }
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log('Загружаю список записей…');
  const rows = [];
  for (const PAGE = 100; ; ) {
    const part = await getJson(`${ORIGIN}/cdumpo/api/news/list?offset=${rows.length}&limit=${PAGE}&full=1`);
    rows.push(...part);
    if (part.length < PAGE) break;
  }
  console.log(`Получено записей: ${rows.length}`);

  const used = new Set();
  const items = rows.map((r) => {
    const title = fixCaps(cleanTitle(r.title));
    const date = r.date;
    let slug = `${date.slice(0, 10)}-${slugify(title) || 'zapis'}`;
    for (let n = 2, base = slug; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    const cover = absMedia(r.image) || null;
    const content = r.content || '';
    return {
      oldId: r.id,
      oldUrl: `/cdumpo/article?id=${r.id}`,
      slug,
      newUrl: `/zhizn-ummy/${slug}`,
      kind: RUBRIC[r.category] ?? 'news',
      category: r.category,
      date,
      title,
      originalTitle: r.title,
      lead: r.excerpt ? strip(r.excerpt) : strip(content).slice(0, 220),
      cover,
      html: content,
      media: extractMedia(content, cover),
    };
  });

  items.sort((a, b) => b.date.localeCompare(a.date));
  await writeFile(path.join(OUT, 'news.json'), JSON.stringify(items, null, 2));

  // Редиректы: каждая статья + список новостей и корень старого раздела.
  const redirects = [
    { from: '/cdumpo', to: '/zhizn-ummy' },
    ...items.map((i) => ({ from: i.oldUrl, to: i.newUrl })),
  ];
  await writeFile(path.join(OUT, 'redirects.json'), JSON.stringify(redirects, null, 2));

  const byKind = items.reduce((a, i) => ((a[i.kind] = (a[i.kind] || 0) + 1), a), {});
  console.log('По рубрикам:', byKind);

  const all = new Set();
  for (const i of items) for (const u of [...i.media.images, ...i.media.videos]) all.add(u);
  const mine = [...all].filter((u) => /^https?:\/\/(fs\.chatium\.ru|cdumpo\.ru|[^/]*cdn-chatium\.io)\//.test(u));
  console.log(`Файлов на серверах старого сайта: ${mine.length}`);

  if (!WITH_MEDIA) {
    console.log('Файлы не скачивал. Для скачивания: MEDIA=1 node scripts/scrape-cdumpo.mjs');
    return;
  }

  await mkdir(MEDIA_DIR, { recursive: true });
  const map = {};
  let done = 0;
  let failed = 0;
  const queue = [...mine];
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      const name = fileName(url);
      const res = await download(url, path.join(MEDIA_DIR, name));
      if (res.startsWith('fail')) {
        failed++;
        console.warn(`  ✗ ${url} — ${res}`);
      } else map[url] = name;
      if (++done % 50 === 0) console.log(`  ${done}/${mine.length}`);
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  await writeFile(path.join(OUT, 'media-map.json'), JSON.stringify(map, null, 2));
  console.log(`Скачано: ${Object.keys(map).length}, ошибок: ${failed}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
