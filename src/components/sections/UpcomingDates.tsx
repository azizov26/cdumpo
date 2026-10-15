"use client";

import { upcomingDates } from "@/lib/hijri";
import { TIME_ZONE } from "@/lib/prayer/times";
import { useNow } from "@/lib/prayer/useNow";
import { SectionHeading } from "./SectionHeading";

const dayNum = (d: Date) => d.toLocaleDateString("ru-RU", { day: "numeric", timeZone: TIME_ZONE });
/** «октября» (родительный падеж берём из «16 октября») и, для джумы, день недели. */
function monthLabel(d: Date, withWeekday: boolean) {
  const month = d
    .toLocaleDateString("ru-RU", { day: "numeric", month: "long", timeZone: TIME_ZONE })
    .replace(/^\d+\s/, "");
  const weekday = d.toLocaleDateString("ru-RU", { weekday: "long", timeZone: TIME_ZONE });
  return withWeekday ? `${month} · ${weekday}` : month;
}

/** «Ближайшие даты» (эталон .dates): джума и памятные даты по хиджре, последняя карточка — ночная. */
export function UpcomingDates() {
  const now = useNow();
  const list = now ? upcomingDates(now, 4) : [];

  return (
    <section aria-labelledby="dates-title" className="container-site pt-14 md:pt-24">
      <SectionHeading id="dates-title" label="Календарь хиджры" title="Ближайшие" accent="даты" />
      <ul
        tabIndex={0}
        aria-label="Ближайшие даты"
        className="-mx-5 flex min-h-[170px] snap-x gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0"
      >
        {list.map((d, i) => {
          const hl = i === list.length - 1;
          return (
            <li
              key={d.title}
              className={`w-[46%] shrink-0 snap-start rounded-card border p-[18px] md:w-auto md:p-[22px] ${
                hl ? "border-night bg-night text-light" : "border-line bg-surface"
              }`}
            >
              <p
                className={`tnum font-display text-[40px] leading-none font-semibold md:text-[52px] ${hl ? "text-gold-soft" : ""}`}
              >
                {d.approx && <span title="Дата приблизительная">≈</span>}
                {dayNum(d.date)}
              </p>
              <p
                className={`mt-1 text-[11.5px] font-semibold tracking-[0.1em] uppercase md:text-[12.5px] ${hl ? "text-light/62" : "text-fg-2"}`}
              >
                {monthLabel(d.date, !d.approx)}
              </p>
              <p className="mt-4 text-[15.5px] font-semibold md:mt-[18px]">{d.title}</p>
              <p className={`mt-1.5 text-[12.5px] ${hl ? "text-light/62" : "text-fg-2"}`}>{d.note}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[12.5px] text-fg-2">≈ — дата по расчёту, уточняется по наблюдению луны.</p>
    </section>
  );
}
