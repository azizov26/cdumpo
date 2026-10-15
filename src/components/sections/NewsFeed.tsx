"use client";

import { useEffect, useState } from "react";
import type { NewsItem, NewsPage } from "@/lib/content/news";
import type { Rubric } from "@/lib/content/rubrics";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeaturedNews, NewsRow } from "./NewsCard";

/** Лента «Жизни уммы»: фильтр по рубрике и «Показать ещё». Первая порция приходит с сервера, остальное — по запросу. */
export function NewsFeed({ first, rubrics }: { first: NewsPage; rubrics: Rubric[] }) {
  const [rubric, setRubric] = useState<Rubric | null>(null);
  // Загруженные порции по рубрикам: переключение туда-обратно не ходит на сервер повторно.
  const [pages, setPages] = useState<Record<string, NewsPage>>({ all: first });
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const key = rubric ?? "all";
  const page = pages[key];
  const [query, setQuery] = useState("");
  // Результат хранится вместе с запросом, для которого получен: «Ищем…» — когда он отстаёт от строки поиска.
  const [result, setResult] = useState<{ q: string; items: NewsItem[] | null } | null>(null);
  const q = query.trim();

  async function load(r: Rubric | null, offset: number) {
    setLoading(true);
    setFailed(false);
    try {
      const params = new URLSearchParams({ offset: String(offset) });
      if (r) params.set("rubric", r);
      const res = await fetch(`/umma/lenta?${params}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as NewsPage;
      setPages((prev) => {
        const k = r ?? "all";
        return { ...prev, [k]: { total: data.total, items: [...(prev[k]?.items ?? []), ...data.items] } };
      });
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function pick(r: Rubric | null) {
    setRubric(r);
    if (!pages[r ?? "all"]) void load(r, 0);
  }

  // Поиск идёт на сервере по всем новостям (в ленте только свежие); запрос отправляется после паузы в наборе.
  useEffect(() => {
    if (q.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/umma/poisk?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(String(res.status));
        setResult({ q, items: ((await res.json()) as { items: NewsItem[] }).items });
      } catch (e) {
        if ((e as Error).name !== "AbortError") setResult({ q, items: null });
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  if (first.items.length === 0) {
    return (
      <EmptyState title="Новостей пока нет" sky="dawn">
        Здесь будут новости муфтията и общин области, обращения, видео и фотографии с мероприятий.
      </EmptyState>
    );
  }

  const items = page?.items ?? [];
  const [featured, ...rest] = items;

  const chip = (on: boolean) =>
    `inline-flex h-11 items-center rounded-full px-4 text-[14px] font-semibold whitespace-nowrap transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] ${
      on ? "bg-chip-on text-chip-on-fg" : "bg-chip text-chip-fg"
    }`;

  const searching = q.length >= 2;
  const current = result?.q === q ? result : null;
  const found = current?.items ?? null;

  return (
    <>
      <div role="search" className="relative mb-5 max-w-[520px]">
        <label htmlFor="news-search" className="sr-only">
          Поиск по новостям
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по новостям"
          autoComplete="off"
          maxLength={100}
          className="h-12 w-full rounded-full border border-btn-line bg-btn-line-bg px-5 text-[16px] outline-none placeholder:text-fg-3 focus-visible:border-accent"
        />
      </div>

      {searching ? (
        <section aria-live="polite" aria-label="Результаты поиска">
          {current && current.items === null ? (
            <p className="text-[16px] text-fg-2">Поиск сейчас недоступен. Попробуйте чуть позже.</p>
          ) : found === null ? (
            <p className="text-[16px] text-fg-2">Ищем…</p>
          ) : found.length === 0 ? (
            <p className="text-[16px] text-fg-2">По запросу «{q}» ничего не нашлось.</p>
          ) : (
            <>
              <p className="mb-2 text-[14px] text-fg-2">Найдено: {found.length}</p>
              <ul className="grid gap-x-7 md:grid-cols-2">
                {found.map((n) => (
                  <li key={n.slug} className="border-b border-line py-3.5">
                    <NewsRow item={n} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      ) : (
        <>
          <div
            role="group"
            aria-label="Рубрики"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              aria-pressed={rubric === null}
              onClick={() => pick(null)}
              className={chip(rubric === null)}
            >
              Все
            </button>
            {rubrics.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={rubric === r}
                onClick={() => pick(r)}
                className={chip(rubric === r)}
              >
                {r}
              </button>
            ))}
          </div>

          {!featured ? (
            <p aria-live="polite" className="mt-6 text-[16px] text-fg-2">
              {failed ? "Не удалось загрузить. Попробуйте ещё раз." : "Загружаем…"}
            </p>
          ) : (
            <>
              <div key={key} className="month-in mt-6 grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-7">
                <FeaturedNews item={featured} />
                <ul>
                  {rest.slice(0, 4).map((n) => (
                    <li key={n.slug} className="border-b border-line py-3.5 first:pt-0">
                      <NewsRow item={n} />
                    </li>
                  ))}
                </ul>
              </div>

              {rest.length > 4 && (
                <ul className="month-in mt-2 grid gap-x-7 md:grid-cols-2">
                  {rest.slice(4).map((n) => (
                    <li key={n.slug} className="border-b border-line py-3.5">
                      <NewsRow item={n} />
                    </li>
                  ))}
                </ul>
              )}

              {items.length < (page?.total ?? 0) && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void load(rubric, items.length)}
                  className="mt-8 inline-flex h-12 items-center rounded-full border border-btn-line bg-btn-line-bg px-6 text-[14.5px] font-bold transition-transform duration-150 ease-out hover:border-fg-3 active:scale-[0.97]"
                >
                  {loading ? "Загружаем…" : failed ? "Не удалось. Ещё раз" : "Показать ещё"}
                </button>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
