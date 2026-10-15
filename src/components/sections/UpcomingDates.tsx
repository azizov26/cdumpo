import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { upcomingDates } from "@/mocks/home";
import { SectionHeading } from "./SectionHeading";

/** «Ближайшие даты» (эталон .dates): последняя карточка выделена ночным цветом. */
export function UpcomingDates() {
  return (
    <section aria-labelledby="dates-title" className="container-site pt-14 md:pt-24">
      <SectionHeading
        id="dates-title"
        label="Календарь хиджры"
        title="Ближайшие"
        accent="даты"
        action={
          <Button href="/namaz/kalendar" className="h-[46px] max-md:hidden">
            <Icon name="calendar" />
            Добавить в календарь
          </Button>
        }
      />
      <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
        {upcomingDates.map((d) => (
          <li
            key={d.title}
            className={`w-[46%] shrink-0 snap-start rounded-card border p-[18px] md:w-auto md:p-[22px] ${
              d.highlight ? "border-night bg-night text-light" : "border-line bg-surface"
            }`}
          >
            <p className={`tnum font-display text-[40px] leading-none font-semibold md:text-[52px] ${d.highlight ? "text-gold-soft" : ""}`}>
              {d.approx && <span title="Дата приблизительная">≈</span>}
              {d.day}
            </p>
            <p
              className={`mt-1 text-[11.5px] font-semibold tracking-[0.1em] uppercase md:text-[12.5px] ${
                d.highlight ? "text-light/62" : "text-fg-2"
              }`}
            >
              {d.month}
            </p>
            <p className="mt-4 text-[15.5px] font-semibold md:mt-[18px]">{d.title}</p>
            <p className={`mt-1.5 text-[12.5px] ${d.highlight ? "text-light/62" : "text-fg-2"}`}>{d.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12.5px] text-fg-2">≈ — дата по расчёту, уточняется по наблюдению луны.</p>
    </section>
  );
}
