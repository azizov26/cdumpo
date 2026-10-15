import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/layout/Reveal";
import { CathedralMosqueArt, HistoricMosqueArt } from "@/components/mosques/MosqueArt";
import { yandexMapsUrl, type Mosque } from "@/lib/content/mosques";

/** Рассказ об одной мечети: крупные цифры, история, адрес и маршрут. Рисунок — на ночной карточке. */
export function MosqueStory({ mosque, reverse = false }: { mosque: Mosque; reverse?: boolean }) {
  const Art = mosque.id === "historic" ? HistoricMosqueArt : CathedralMosqueArt;
  return (
    <section
      id={mosque.id}
      aria-labelledby={`${mosque.id}-title`}
      className="container-site scroll-mt-24 pt-16 md:pt-24"
    >
      <Reveal>
        <div
          className={`grid items-start gap-8 lg:grid-cols-2 lg:gap-14 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
        >
          <div
            data-theme="dark"
            className="overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_50%_90%,#1E2A5C_0%,#0B1636_75%)] px-4 pt-8 lg:sticky lg:top-24"
          >
            <Art className="w-full" />
          </div>

          <div>
            <p className="eyebrow">{mosque.kicker}</p>
            <h2
              id={`${mosque.id}-title`}
              className="mt-2 font-display text-[40px] leading-none font-medium md:text-[60px]"
            >
              {mosque.name}
            </h2>

            <dl className="mt-7 grid grid-cols-3 gap-3 border-y border-line py-5">
              {mosque.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display text-[26px] leading-none font-medium text-accent md:text-[36px]">
                    {f.value}
                  </dd>
                  <dd className="mt-1.5 text-[13px] leading-[1.35] text-fg-2 md:text-[14px]">{f.label}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 grid gap-4 text-[17px] leading-[1.6] text-fg-2">
              {mosque.story.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            {mosque.quote && (
              <figure className="mt-7 border-l-2 border-accent pl-5">
                <blockquote className="font-display text-[24px] leading-[1.2] italic md:text-[28px]">
                  «{mosque.quote.text}»
                </blockquote>
                <figcaption className="mt-2 text-[14px] text-fg-3">— {mosque.quote.by}</figcaption>
              </figure>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[20px] border border-line bg-surface p-4 md:p-5">
              <Icon name="mosques" className="size-[22px] text-accent" />
              <span className="mr-auto text-[16px] font-semibold">{mosque.address}</span>
              <a
                href={yandexMapsUrl(mosque.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[44px] items-center gap-2 rounded-full border border-btn-line bg-btn-line-bg px-4 text-[14.5px] font-bold text-fg transition-colors duration-200 hover:border-fg-3"
              >
                Маршрут в Яндекс Картах
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
