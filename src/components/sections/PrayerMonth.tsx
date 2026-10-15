"use client";

import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import {
  getMonthRows,
  getYearDaylight,
  monthOf,
  MONTHS,
  MONTHS_IN,
  MONTHS_SHORT,
  weekStartIndex,
  type Daylight,
  type MonthRow,
} from "@/lib/prayer/month";
import { dateKey, formatTime, PRAYER_NAMES, PRAYER_ORDER } from "@/lib/prayer/times";
import { useSkyClock } from "@/lib/prayer/useSkyClock";

// Время намаза на месяц — сразу под небом главной (решение заказчика, 15.10.2026).
// Выбор месяца — «капсулы неба»: в каждой видно, сколько длится день в этом месяце.

export const MONTH_SECTION_ID = "namaz-month";

const daysWord = (n: number) => (n % 10 === 1 && n !== 11 ? "день" : "дней"); // 28–31

/** Сутки сверху вниз: полоса сумерек (фаджр → иша) и светлое время (восход → магриб). */
function Capsule({ d }: { d: Daylight | undefined }) {
  const seg = (from: number, to: number) => ({ top: `${from * 100}%`, height: `${(to - from) * 100}%` });
  return (
    <span
      aria-hidden="true"
      className="capsule relative block h-10 w-2 overflow-hidden rounded-full bg-[color:var(--capsule-track)]"
    >
      {d && (
        <>
          <span
            className="absolute inset-x-0 rounded-full bg-[color:var(--capsule-twilight)]"
            style={seg(d.fajr, d.isha)}
          />
          <span
            className="absolute inset-x-0 rounded-full bg-[color:var(--capsule-day)]"
            style={seg(d.sunrise, d.maghrib)}
          />
        </>
      )}
    </span>
  );
}

const MonthPicker = memo(function MonthPicker({
  year,
  month,
  current,
  daylight,
  onPick,
}: {
  year: number | null;
  month: number | null;
  current: number | null;
  daylight: Daylight[] | null;
  onPick: (m: number) => void;
}) {
  const strip = useRef<HTMLDivElement>(null);

  // На телефоне лента месяцев прокручивается — держим выбранный месяц в центре.
  useEffect(() => {
    const el = strip.current;
    const btn = month === null ? null : el?.children[month];
    if (!el || !(btn instanceof HTMLElement) || el.scrollWidth <= el.clientWidth) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: btn.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [month]);

  return (
    <div
      ref={strip}
      role="group"
      aria-label={year ? `Месяц ${year} года` : "Месяц"}
      className="-mx-5 flex snap-x gap-1.5 overflow-x-auto px-5 pt-0.5 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-12 md:overflow-visible md:px-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden"
    >
      {MONTHS_SHORT.map((label, i) => {
        const on = i === month;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={on}
            aria-label={`${MONTHS[i]}${i === current ? ", текущий месяц" : ""}`}
            disabled={year === null}
            onClick={() => onPick(i)}
            className={`relative flex h-[84px] w-[52px] shrink-0 snap-center flex-col items-center justify-center gap-2 rounded-m border text-[12.5px] font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97] md:w-auto ${
              on
                ? "border-transparent bg-chip-on text-chip-on-fg"
                : "border-line bg-surface text-fg-2 hover:border-fg-3 hover:text-fg"
            }`}
          >
            <Capsule d={daylight?.[i]} />
            {label}
            {i === current && (
              <span
                aria-hidden="true"
                className={`absolute top-2 right-2 size-1.5 rounded-full ${on ? "bg-zarya" : "bg-accent"}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
});

type TableProps = {
  rows: MonthRow[] | null;
  todayKey: string | null;
  /** «2026-10-15:maghrib» — ближайший намаз, как в строке на небе. */
  nextKey: string | null;
  /** Свёрнутый вид на телефоне: показываем неделю [from, from + 7). */
  from: number;
  collapsed: boolean;
  month: number | null;
};

const MonthTable = memo(function MonthTable({ rows, todayKey, nextKey, from, collapsed, month }: TableProps) {
  // Телефон: шапка прилегает к плашке отсчёта (CompactBar: отступ сверху + 62 px высоты).
  const head =
    "sticky top-[calc(max(8px,env(safe-area-inset-top))+61px)] z-10 h-11 border-b border-line bg-[color:var(--thead-bg)] font-semibold text-fg-2 md:top-0";
  return (
    <table className="tnum w-full border-separate border-spacing-0 text-center">
      <caption className="sr-only">
        Время намаза в Пензе{month !== null && `, ${MONTHS[month]}`}, московское время
      </caption>
      <thead className="text-[11px] md:text-[11.5px] md:tracking-[0.08em] md:uppercase">
        <tr>
          <th scope="col" className={`${head} rounded-tl-[23px] pl-3 text-left md:pl-5`}>
            День
          </th>
          {PRAYER_ORDER.map((k, i) => (
            <th
              key={k}
              scope="col"
              className={`${head} px-0.5 md:w-[13%] ${i === PRAYER_ORDER.length - 1 ? "rounded-tr-[23px]" : ""}`}
            >
              {PRAYER_NAMES[k]}
            </th>
          ))}
        </tr>
      </thead>
      {rows ? (
        <tbody key={month} className="month-in">
          {rows.map((r, i) => {
            const hide = collapsed && (i < from || i >= from + 7) ? "max-md:hidden" : "";
            const today = r.key === todayKey;
            const past = todayKey !== null && r.key < todayKey;
            const rule = today ? "border-transparent" : r.monday ? "border-line" : "border-[color:var(--row-rule)]";
            const cell = `border-t ${rule} h-11`;
            return (
              <Fragment key={r.key}>
                {r.hijriStart && (
                  <tr className={hide}>
                    <td
                      colSpan={7}
                      className={`border-t ${rule} h-9 pl-3 text-left text-[12px] font-semibold text-accent md:pl-5`}
                    >
                      ≈ {r.hijriStart}
                      <span className="font-medium text-fg-2 max-sm:hidden"> · начало месяца по хиджре</span>
                    </td>
                  </tr>
                )}
                <tr
                  aria-current={today ? "date" : undefined}
                  className={`${hide} ${
                    today
                      ? "bg-[color:var(--row-today)] text-[color:var(--row-today-fg)]"
                      : r.friday
                        ? "bg-[color:var(--row-friday)]"
                        : ""
                  } ${past ? "text-fg-2" : ""}`}
                >
                  <th scope="row" className={`${cell} pl-3 text-left font-normal whitespace-nowrap md:pl-5`}>
                    {/* Телефон: день недели под числом — иначе семь столбцов не помещаются в 320 px. */}
                    <span className="block font-display text-[19px] leading-none font-semibold md:inline-block md:min-w-[1.3em] md:text-[22px]">
                      {r.day}
                    </span>
                    <span
                      className={`block text-[10.5px] leading-tight md:ml-2 md:inline md:text-[12.5px] ${
                        r.friday
                          ? `font-bold ${today ? "text-[color:var(--row-today-time)]" : "text-accent"}`
                          : today
                            ? "opacity-75"
                            : "text-fg-2"
                      }`}
                    >
                      {r.weekday}
                      {r.friday && <span className="max-lg:sr-only"> · джума</span>}
                    </span>
                  </th>
                  {PRAYER_ORDER.map((k) => {
                    const next = nextKey === `${r.key}:${k}`;
                    return (
                      <td
                        key={k}
                        className={`${cell} px-0.5 text-[14px] md:text-[16px] lg:text-[17px] ${
                          k === "sunrise" && !today ? "text-fg-2" : ""
                        } ${today && !next ? "font-semibold" : ""}`}
                      >
                        {next ? (
                          <span className="-mx-1 inline-flex h-7 items-center rounded-full bg-zarya px-1 font-bold text-on-gold md:mx-0 md:h-8 md:px-3">
                            <span className="sr-only">ближайший намаз — </span>
                            {formatTime(r.times[k])}
                          </span>
                        ) : (
                          formatTime(r.times[k])
                        )}
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      ) : (
        // До гидратации времени нет: держим высоту таблицы, чтобы страница не прыгала.
        <tbody aria-hidden="true">
          {Array.from({ length: 31 }, (_, i) => (
            <tr key={i} className={i >= 7 ? "max-md:hidden" : ""}>
              <td colSpan={7} className="h-10 border-t border-[color:var(--row-rule)] md:h-11" />
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
});

export function PrayerMonth() {
  const clock = useSkyClock();
  const now = clock?.now ?? null;
  const current = now ? monthOf(now) : null;
  const [picked, setPicked] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const section = useRef<HTMLElement>(null);

  const year = current?.year ?? null;
  const month = picked ?? current?.month ?? null;
  const isCurrent = month !== null && month === current?.month;

  const rows = useMemo(() => (year !== null && month !== null ? getMonthRows(year, month) : null), [year, month]);
  const daylight = useMemo(() => (year !== null ? getYearDaylight(year) : null), [year]);
  const todayKey = now ? dateKey(now) : null;
  const nextKey = clock ? `${dateKey(clock.next.at)}:${clock.next.key}` : null;
  const from = rows && isCurrent && todayKey ? weekStartIndex(rows, Number(todayKey.slice(8))) : 0;
  const estimated = rows?.some((r) => !r.fromTable) ?? false;

  const collapse = () => {
    setExpanded(false);
    const top = section.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) section.current?.scrollIntoView({ block: "start" });
  };

  // Печать (и «Сохранить как PDF» в диалоге печати) — только эта таблица, весь месяц.
  const print = () => {
    const html = document.documentElement;
    html.dataset.print = MONTH_SECTION_ID;
    flushSync(() => setExpanded(true));
    const done = () => {
      delete html.dataset.print;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  };

  const printButton = (
    <button
      type="button"
      onClick={print}
      disabled={!rows}
      className="inline-flex h-12 items-center gap-2 rounded-full border border-btn-line bg-btn-line-bg px-5 text-[14.5px] font-bold transition-[border-color,transform] duration-150 ease-out hover:border-fg-3 active:scale-[0.97] disabled:opacity-50 print:hidden"
    >
      <Icon name="download" className="size-[18px] text-accent" />
      Распечатать или сохранить PDF
    </button>
  );

  return (
    <section
      ref={section}
      id={MONTH_SECTION_ID}
      aria-labelledby="namaz-month-title"
      className="container-site scroll-mt-24 pt-10 md:pt-20 lg:grid lg:grid-cols-[minmax(300px,340px)_1fr] lg:items-start lg:gap-14 print:block print:pt-0"
    >
      <div className="lg:sticky lg:top-10">
        <p className="eyebrow">Пенза{year && ` · ${year}`}</p>
        <h2
          id="namaz-month-title"
          className="mt-2 font-display text-[32px] leading-none font-medium md:text-[44px] lg:text-[52px] lg:leading-[1.02]"
        >
          Время намаза{" "}
          <em key={month ?? "none"} className="month-in inline-block text-accent">
            {month !== null ? `в ${MONTHS_IN[month]}` : "на месяц"}
          </em>
        </h2>
        <p className="mt-3 max-w-[38ch] text-[15px] leading-[1.55] text-fg-2 md:mt-4">
          Московское время. Сегодняшний день выделен, ближайший намаз — золотом.
        </p>
        <p className="mt-1 hidden text-[13px] text-fg-2 print:block">
          Централизованное духовное управление мусульман Пензенской области · cdumpo.ru
        </p>

        <div className="mt-6 print:hidden">
          <MonthPicker
            year={year}
            month={month}
            current={current?.month ?? null}
            daylight={daylight}
            onPick={setPicked}
          />
          <p className="mt-2.5 text-[12.5px] text-fg-2">
            Полоска — долгота дня в середине месяца: от восхода до магриба.
          </p>
        </div>

        <div className="mt-7 hidden lg:block">{printButton}</div>
      </div>

      <div className="mt-6 lg:mt-0">
        <div className="overflow-clip rounded-[24px] border border-line bg-surface shadow-card [[data-theme=dark]_&]:shadow-none print:shadow-none">
          <MonthTable
            rows={rows}
            todayKey={todayKey}
            nextKey={nextKey}
            from={from}
            collapsed={!expanded}
            month={month}
          />
        </div>

        {rows && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => (expanded ? collapse() : setExpanded(true))}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-btn-line bg-btn-line-bg text-[14.5px] font-bold transition-transform duration-150 ease-out active:scale-[0.98] md:hidden print:hidden"
          >
            {expanded ? "Свернуть до недели" : `Весь ${MONTHS[month!]} · ${rows.length} ${daysWord(rows.length)}`}
            <Icon name="chevron-down" className={`size-[18px] text-accent ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-fg-2">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-5 rounded-[4px] bg-[color:var(--row-today)] ring-1 ring-line" />
            Сегодня
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-5 rounded-full bg-zarya" />
            Ближайший намаз
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-5 rounded-[4px] bg-[color:var(--row-friday)] ring-1 ring-line" />
            Пятница — джума
          </li>
          <li>≈ — дата по хиджре по расчёту, уточняется по луне</li>
          {estimated && <li>Часть дней — предварительное время по расчёту</li>}
        </ul>

        <div className="mt-6 lg:hidden">{printButton}</div>
      </div>
    </section>
  );
}
