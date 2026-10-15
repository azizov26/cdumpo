import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Tag";
import { SkyPicture } from "@/components/sky/SkyGraphic";
import { news, RUBRICS } from "@/mocks/home";
import { SectionHeading } from "./SectionHeading";

/** «Жизнь уммы» (эталон .news): главная новость + список с миниатюрами. */
export function UmmahLife() {
  const [featured, ...rest] = news;
  return (
    <section aria-labelledby="umma-title" className="container-site pt-14 md:pt-24">
      <SectionHeading
        id="umma-title"
        label="Новости · видео · фото"
        title="Жизнь"
        accent="уммы"
        action={
          <div className="flex w-full items-center gap-2 md:w-auto">
            <ul aria-label="Рубрики" className="-mx-5 flex flex-1 gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
              <li>
                <Chip on>Все</Chip>
              </li>
              {RUBRICS.map((r) => (
                <li key={r}>
                  <Chip>{r}</Chip>
                </li>
              ))}
            </ul>
            <Link
              href="/umma"
              className="ml-4 hidden min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-accent md:inline-flex"
            >
              Все новости <Icon name="arrow-right" className="size-[18px]" />
            </Link>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-7">
        <article className="group relative overflow-hidden rounded-[24px] border border-line bg-surface">
          <SkyPicture sky={featured.sky} width={640} height={320} className="h-[200px] md:h-[320px]" />
          <div className="px-5 pt-5 pb-6 md:px-7 md:pt-6 md:pb-7">
            <p className="flex items-center gap-2.5 text-[12.5px] text-fg-2">
              <Chip>{featured.rubric}</Chip>
              <time>{featured.date}</time>
            </p>
            <h3 className="mt-1.5 font-display text-[24px] leading-[1.12] font-semibold md:text-[32px]">
              <Link href={`/umma/${featured.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
                {featured.title}
              </Link>
            </h3>
            {featured.lead && <p className="mt-2.5 line-clamp-3 text-[15px] leading-[1.55] text-fg-2">{featured.lead}</p>}
          </div>
        </article>

        <ul>
          {rest.map((n) => (
            <li key={n.slug} className="border-b border-line py-3.5">
              <article className="group relative grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[120px_1fr]">
                <SkyPicture sky={n.sky} width={240} height={168} className="h-[68px] rounded-m md:h-[84px]" />
                <div>
                  <p className="flex items-center gap-2.5 text-[12.5px] text-fg-2">
                    <Chip>{n.rubric}</Chip>
                    <time>{n.date}</time>
                  </p>
                  <h3 className="mt-1.5 font-display text-[19px] leading-[1.12] font-semibold md:text-[21px]">
                    <Link href={`/umma/${n.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
                      {n.title}
                    </Link>
                  </h3>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
