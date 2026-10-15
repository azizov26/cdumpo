"use client";

import { useState } from "react";
import { RUBRICS, type NewsItem, type Rubric } from "@/lib/content/news";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeaturedNews, NewsRow } from "./NewsCard";

const PAGE = 12;

/** Лента «Жизни уммы»: фильтр по рубрике и «Показать ещё». Данные приходят с сервера. */
export function NewsFeed({ items }: { items: NewsItem[] }) {
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [shown, setShown] = useState(PAGE);

  if (items.length === 0) {
    return (
      <EmptyState title="Новостей пока нет" sky="dawn">
        Здесь будут новости муфтията и общин области, обращения, видео и фотографии с мероприятий.
      </EmptyState>
    );
  }

  const present = RUBRICS.filter((r) => items.some((n) => n.rubric === r));
  const list = rubric ? items.filter((n) => n.rubric === rubric) : items;
  const [featured, ...rest] = list;
  const visible = rest.slice(0, shown);

  const chip = (on: boolean) =>
    `inline-flex h-11 items-center rounded-full px-4 text-[14px] font-semibold whitespace-nowrap transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] ${
      on ? "bg-chip-on text-chip-on-fg" : "bg-chip text-chip-fg"
    }`;

  return (
    <>
      <div role="group" aria-label="Рубрики" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
        <button type="button" aria-pressed={rubric === null} onClick={() => { setRubric(null); setShown(PAGE); }} className={chip(rubric === null)}>
          Все
        </button>
        {present.map((r) => (
          <button key={r} type="button" aria-pressed={rubric === r} onClick={() => { setRubric(r); setShown(PAGE); }} className={chip(rubric === r)}>
            {r}
          </button>
        ))}
      </div>

      <div key={rubric ?? "all"} className="month-in mt-6 grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-7">
        <FeaturedNews item={featured} />
        <ul>
          {visible.slice(0, 4).map((n) => (
            <li key={n.slug} className="border-b border-line py-3.5 first:pt-0">
              <NewsRow item={n} />
            </li>
          ))}
        </ul>
      </div>

      {visible.length > 4 && (
        <ul className="month-in mt-2 grid gap-x-7 md:grid-cols-2">
          {visible.slice(4).map((n) => (
            <li key={n.slug} className="border-b border-line py-3.5">
              <NewsRow item={n} />
            </li>
          ))}
        </ul>
      )}

      {rest.length > shown && (
        <button
          type="button"
          onClick={() => setShown((s) => s + PAGE)}
          className="mt-8 inline-flex h-12 items-center rounded-full border border-btn-line bg-btn-line-bg px-6 text-[14.5px] font-bold transition-transform duration-150 ease-out hover:border-fg-3 active:scale-[0.97]"
        >
          Показать ещё
        </button>
      )}
    </>
  );
}
