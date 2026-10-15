"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  dateKey,
  formatDate,
  formatHijri,
  formatTime,
  getDayTimes,
  hasTable,
  PRAYER_NAMES,
  PRAYER_NAMES_AR,
  PRAYER_ORDER,
  PRAYER_UNTIL,
  TIME_ZONE,
} from "@/lib/prayer/times";
import { useSkyClock } from "@/lib/prayer/useSkyClock";
import { formatCountdown } from "./TodaySky";

// Страница «Намаз»: выбранный день и неделя (концепция 2.0, слайд 7). Месяц — ниже, в PrayerMonth.

const DAY = 86_400_000;
const at = (key: string) => new Date(`${key}T12:00:00+03:00`);
const addDays = (key: string, n: number) => dateKey(new Date(at(key).getTime() + n * DAY));
/** Номер дня недели, понедельник = 0. */
const weekday = (key: string) => (at(key).getUTCDay() + 6) % 7;
const short = (key: string) => at(key).toLocaleDateString("ru-RU", { weekday: "short", timeZone: TIME_ZONE });
const dayNum = (key: string) => Number(key.slice(8));
const weekRange = (keys: string[]) => {
  const f = (k: string, withMonth: boolean) =>
    at(k).toLocaleDateString("ru-RU", { day: "numeric", ...(withMonth && { month: "long" }), timeZone: TIME_ZONE });
  const sameMonth = keys[0].slice(5, 7) === keys[6].slice(5, 7);
  return `${f(keys[0], !sameMonth)} — ${f(keys[6], true)}`;
};

export function NamazDay() {
  const clock = useSkyClock();
  const todayKey = clock ? dateKey(clock.now) : null;
  const [offset, setOffset] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const week = useMemo(() => {
    if (!todayKey) return null;
    const start = addDays(todayKey, -weekday(todayKey) + 7 * offset);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [todayKey, offset]);

  const selected = picked ?? todayKey;
  const isToday = selected !== null && selected === todayKey;
  const times = useMemo(() => (selected ? getDayTimes(at(selected)) : null), [selected]);
  const next = clock?.next;

  const moveWeek = (delta: number) => {
    const o = offset + delta;
    setOffset(o);
    setPicked(o === 0 || !todayKey ? null : addDays(todayKey, -weekday(todayKey) + 7 * o));
  };

  const nav =
    "grid size-11 place-items-center rounded-full border border-line bg-surface text-fg transition-[border-color,transform] duration-150 ease-out hover:border-fg-3 active:scale-[0.95]";

  return (
    <section aria-labelledby="namaz-day-title" className="container-site pt-8 md:pt-12">
      <div className="mx-auto max-w-[760px] lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-[minmax(300px,340px)_1fr] lg:gap-14">
        <div>
          <h2 id="namaz-day-title" className="eyebrow">
            Пенза · неделя
          </h2>
          <p className="tnum mt-1.5 text-[14px] text-fg-2">{week ? weekRange(week) : " "}</p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              aria-label="Предыдущая неделя"
              onClick={() => moveWeek(-1)}
              className={nav}
              disabled={!week}
            >
              <Icon name="arrow-right" className="size-[18px] rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Следующая неделя"
              onClick={() => moveWeek(1)}
              className={nav}
              disabled={!week}
            >
              <Icon name="arrow-right" className="size-[18px]" />
            </button>
            {offset !== 0 && (
              <button
                type="button"
                onClick={() => {
                  setOffset(0);
                  setPicked(null);
                }}
                className="ml-1 min-h-11 text-[14.5px] font-semibold text-accent"
              >
                К сегодняшнему дню
              </button>
            )}
          </div>
          <div role="group" aria-label="День недели" className="mt-4 grid grid-cols-7 gap-1.5">
            {(week ?? Array.from({ length: 7 }, () => null)).map((key, i) => {
              const on = key !== null && key === selected;
              return (
                <button
                  key={key ?? i}
                  type="button"
                  disabled={!key}
                  aria-pressed={on}
                  aria-label={
                    key
                      ? at(key).toLocaleDateString("ru-RU", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          timeZone: TIME_ZONE,
                        })
                      : undefined
                  }
                  onClick={() => key && setPicked(key === todayKey ? null : key)}
                  className={`relative flex h-[68px] flex-col items-center justify-center gap-1 rounded-m border transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] ${
                    on
                      ? "border-transparent bg-chip-on text-chip-on-fg"
                      : "border-line bg-surface text-fg hover:border-fg-3"
                  }`}
                >
                  <span className={`text-[12px] font-semibold uppercase ${on ? "" : "text-fg-2"}`}>
                    {key ? short(key) : " "}
                  </span>
                  <span className="tnum font-display text-[22px] leading-none font-semibold">
                    {key ? dayNum(key) : " "}
                  </span>
                  {key === todayKey && (
                    <span
                      aria-hidden="true"
                      className={`absolute top-1.5 right-1.5 size-1.5 rounded-full ${on ? "bg-zarya" : "bg-accent"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 lg:mt-0">
          <div className="overflow-hidden rounded-[24px] border border-line bg-surface shadow-card [[data-theme=dark]_&]:shadow-none">
            <div className="border-b border-line px-5 py-4 md:px-7 md:py-5">
              <p className="min-h-[1.5em] font-display text-[26px] leading-tight font-semibold first-letter:uppercase md:text-[32px]">
                {selected ? formatDate(at(selected)) : " "}
              </p>
              <p className="tnum mt-1 min-h-[1.5em] text-[14px] text-fg-2">
                {selected && `${formatHijri(at(selected))}${isToday ? " · сегодня" : ""}`}
              </p>
            </div>

            {isToday && next && clock && (
              <div
                data-theme="dark"
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 bg-night px-5 py-4 text-light md:px-7"
              >
                <div>
                  <p className="text-[13px] text-light/70">{PRAYER_UNTIL[next.key]}</p>
                  <p className="tnum font-count text-[40px] leading-none md:text-[48px]">
                    {formatCountdown(next.at.getTime() - clock.now.getTime())}
                  </p>
                </div>
                <p className="text-[14px] text-light/78">
                  {PRAYER_NAMES[next.key]} в {formatTime(next.at)}
                </p>
              </div>
            )}

            <ol key={selected ?? "none"} className="month-in tnum" aria-label="Время намаза">
              {PRAYER_ORDER.map((k) => {
                const on = isToday && next?.key === k;
                const minor = k === "sunrise";
                return (
                  <li
                    key={k}
                    aria-current={on ? "time" : undefined}
                    className={`flex min-h-[60px] items-center justify-between gap-4 border-b border-[color:var(--row-rule)] px-5 last:border-b-0 md:min-h-[68px] md:px-7 ${
                      on ? "bg-zarya text-on-gold" : ""
                    }`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className={`text-[17px] font-semibold md:text-[19px] ${minor && !on ? "text-fg-2" : ""}`}>
                        {PRAYER_NAMES[k]}
                      </span>
                      <span
                        lang="ar"
                        dir="rtl"
                        className={`font-ar text-[22px] ${on ? "text-on-gold/80" : "text-accent"}`}
                      >
                        {PRAYER_NAMES_AR[k]}
                      </span>
                    </span>
                    <span
                      className={`text-[24px] md:text-[28px] ${on ? "font-bold" : "font-medium"} ${minor && !on ? "text-fg-2" : ""}`}
                    >
                      {times ? formatTime(times[k]) : "—:—"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="mt-3 text-[12.5px] text-fg-2">
            Московское время. Восход — не намаз: он показывает, когда заканчивается время фаджра.
            {selected && !hasTable(at(selected)) && " Время на эту дату — предварительное, по расчёту."}
          </p>
        </div>
      </div>
    </section>
  );
}
