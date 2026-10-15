"use client";

import { useState } from "react";
import { eventsBetween, HIJRI_MONTH_NAMES, toHijri } from "@/lib/hijri";
import { getMonthRows, MONTHS, monthOf } from "@/lib/prayer/month";
import { dateKey, TIME_ZONE } from "@/lib/prayer/times";
import { useNow } from "@/lib/prayer/useNow";

const WEEK = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
const noon = (key: string) => new Date(`${key}T12:00:00+03:00`);
const fmtDate = (d: Date) => d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", timeZone: TIME_ZONE });

const navBtn =
  "inline-flex size-[44px] items-center justify-center rounded-full border border-line text-[18px] text-fg transition-colors duration-200 hover:border-fg-3";

export function HijriCalendar() {
  const now = useNow();
  const [shift, setShift] = useState(0);
  if (!now) return <div className="min-h-[520px]" aria-hidden />;

  const base = monthOf(now);
  const idx = base.year * 12 + base.month + shift;
  const year = Math.floor(idx / 12);
  const month = idx % 12;
  const rows = getMonthRows(year, month);
  const today = dateKey(now);
  const lead = (new Date(Date.UTC(year, month, 1, 9)).getUTCDay() + 6) % 7; // понедельник — первый столбец

  const hij = rows.map((r) => toHijri(noon(r.key)));
  // Ячейки по неделям: у role="grid" дети — строки (role="row"), у строк — ячейки.
  const cells = [...Array<null>(lead).fill(null), ...rows.map((r, i) => ({ r, h: hij[i] }))];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, w) => {
    const week = cells.slice(w * 7, w * 7 + 7);
    return [...week, ...Array<null>(7 - week.length).fill(null)];
  });
  const names = [...new Set(hij.map((h) => `${HIJRI_MONTH_NAMES[h.month - 1]} ${h.year}`))];
  const events = eventsBetween(noon(rows[0].key), noon(rows[rows.length - 1].key));
  const evByKey = new Map(events.map((e) => [dateKey(e.date), e]));

  const th = toHijri(now);
  const upcoming = eventsBetween(now, new Date(now.getTime() + 366 * 86_400_000));

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" aria-label="Предыдущий месяц" onClick={() => setShift(shift - 1)} className={navBtn}>
            ←
          </button>
          <div className="text-center">
            <h2 className="font-display text-[30px] leading-none font-medium capitalize md:text-[40px]">
              {MONTHS[month]} {year}
            </h2>
            <p className="mt-1 text-[14px] text-fg-3">{names.join(" — ")}</p>
          </div>
          <button type="button" aria-label="Следующий месяц" onClick={() => setShift(shift + 1)} className={navBtn}>
            →
          </button>
        </div>

        <div role="grid" aria-label={`${MONTHS[month]} ${year}`} className="mt-6">
          <div role="row" className="grid grid-cols-7 text-center text-[13px] font-semibold text-fg-3">
            {WEEK.map((w, i) => (
              <span key={w} role="columnheader" className={i === 4 ? "text-accent" : ""}>
                {w}
              </span>
            ))}
          </div>
          <div className="mt-2 grid gap-1 md:gap-1.5">
            {weeks.map((week, wi) => (
              <div key={wi} role="row" className="grid grid-cols-7 gap-1 md:gap-1.5">
                {week.map((cell, ci) => {
                  if (!cell) return <span key={`b${ci}`} role="presentation" />;
                  const { r, h } = cell;
                  const ev = evByKey.get(r.key);
                  const isToday = r.key === today;
                  return (
                    <div
                      key={r.key}
                      role="gridcell"
                      aria-current={isToday ? "date" : undefined}
                      title={ev?.title}
                      className={`relative flex min-h-[56px] flex-col items-center justify-center rounded-[14px] border md:min-h-[72px] ${
                        isToday ? "border-zarya bg-zarya text-on-gold" : ev ? "border-zarya" : "border-line"
                      }`}
                    >
                      <span
                        className={`text-[17px] font-semibold md:text-[19px] ${r.friday && !isToday ? "text-accent" : ""}`}
                      >
                        {r.day}
                      </span>
                      <span className={`text-[11px] md:text-[12px] ${isToday ? "text-on-gold/75" : "text-fg-3"}`}>
                        {h.day === 1 ? HIJRI_MONTH_NAMES[h.month - 1].slice(0, 7) : h.day}
                      </span>
                      {ev && <span aria-hidden className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-zarya" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[13px] leading-[1.5] text-fg-3">
          Мелкие цифры — день месяца по хиджре (календарь Умм аль-Кура). Пятница — золотая. Золотая точка — памятная
          дата.
        </p>
        {events.length > 0 && (
          <ul className="mt-5 space-y-2 text-[16px]">
            {events.map((e) => (
              <li key={e.title} className="flex flex-wrap gap-x-3">
                <b>≈ {fmtDate(e.date)}</b>
                <span className="text-fg-2">{e.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="rounded-[24px] border border-line p-6">
        <p className="text-[13px] font-semibold tracking-[0.08em] text-fg-3 uppercase">Сегодня по хиджре</p>
        <p className="font-display mt-2 text-[34px] leading-[1.1] font-medium">
          {th.day} {HIJRI_MONTH_NAMES[th.month - 1]} {th.year}
        </p>
        <h3 className="mt-7 text-[13px] font-semibold tracking-[0.08em] text-fg-3 uppercase">Ближайшие даты</h3>
        <ul className="mt-3 space-y-3">
          {upcoming.slice(0, 5).map((e) => (
            <li key={e.title} className="text-[15px] leading-[1.4]">
              <b>≈ {fmtDate(e.date)}</b>
              <br />
              <span className="text-fg-2">
                {e.title} · {e.note}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[13px] leading-[1.5] text-fg-3">
          «≈» — дата приблизительная: начало месяца определяют по появлению луны, и оно может сдвинуться на день.
        </p>
      </aside>
    </div>
  );
}
