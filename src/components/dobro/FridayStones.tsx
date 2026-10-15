import { DonateForm } from "@/components/dobro/DonateForm";
import { formatRub } from "@/lib/content/cathedral";
import type { DonationStats } from "@/lib/content/donations";

// Регулярная помощь в нашей концепции: каждую пятницу подписчики вместе кладут общий ряд камней.
// Вместо «топа спонсоров» — сами пятничные ряды: один камень — один человек, без имён и рейтингов.

const dayMonth = (iso: string) =>
  new Date(`${iso}T12:00:00+03:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Moscow",
  });

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10,
    m100 = n % 100;
  return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
};

export function FridayStones({ stats, open }: { stats: DonationStats; open: boolean }) {
  const max = Math.max(...stats.fridays.map((f) => f.donors));
  return (
    <section
      aria-labelledby="friday-title"
      data-theme="dark"
      className="grid gap-8 overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_30%_40%,#1B2658_0%,#0B1636_70%)] p-5 text-light md:p-10 lg:grid-cols-[1fr_520px] lg:p-14"
    >
      <div>
        <p className="eyebrow">Камень каждую пятницу</p>
        <h2
          id="friday-title"
          className="mt-2 font-display text-[32px] leading-none font-medium lg:text-[48px] lg:leading-[1.02]"
        >
          Пятничный ряд <em className="text-gold-soft">кладём вместе</em>
        </h2>
        <p className="mt-3.5 max-w-[52ch] text-[15px] leading-[1.6] text-light/75 lg:text-[17px]">
          Подписка — самый надёжный способ помогать стройке. Каждую пятницу ваш камень сам ложится в общий ряд, даже
          если неделя выдалась тяжёлой.
        </p>

        <p className="mt-7 flex items-baseline gap-3">
          <span className="font-display text-[52px] leading-none font-medium">{stats.fridaySubscribers}</span>
          <span className="text-[15px] text-light/75">
            {plural(stats.fridaySubscribers, "человек кладёт", "человека кладут", "человек кладут")} камень каждую
            пятницу
          </span>
        </p>

        <figure className="mt-7">
          <figcaption className="text-[13px] font-semibold tracking-[0.08em] text-light/55 uppercase">
            Последние пятничные ряды
          </figcaption>
          <ol className="mt-3 grid gap-2.5">
            {stats.fridays.map((f, i) => {
              const last = i === stats.fridays.length - 1;
              return (
                <li key={f.date} className="grid grid-cols-[86px_1fr_auto] items-center gap-3 text-[13.5px]">
                  <span className={last ? "text-gold-soft" : "text-light/60"}>{dayMonth(f.date)}</span>
                  <svg
                    viewBox={`0 0 ${max * 4} 4`}
                    preserveAspectRatio="xMinYMid meet"
                    role="img"
                    aria-label={`${f.donors} ${plural(f.donors, "камень", "камня", "камней")}`}
                    className="h-[9px] w-full"
                  >
                    {Array.from({ length: f.donors }, (_, k) => (
                      <rect
                        key={k}
                        x={k * 4}
                        y="0"
                        width="3.4"
                        height="4"
                        rx=".5"
                        className="fill-gold-soft"
                        opacity={last ? 1 : 0.45}
                      />
                    ))}
                  </svg>
                  <span className={`tabular-nums ${last ? "text-light" : "text-light/60"}`}>{formatRub(f.amount)}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-[13px] text-light/55">Один камень — один человек. Без имён и рейтингов.</p>
        </figure>
      </div>

      <div className="self-start">
        <DonateForm open={open} initialFreq="Каждую пятницу" presets={[300, 500, 1000, 5000]} />
      </div>
    </section>
  );
}
