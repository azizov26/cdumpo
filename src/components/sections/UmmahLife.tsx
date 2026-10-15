import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Tag";
import { getLatestNews, RUBRICS } from "@/lib/content/news";
import { FeaturedNews, NewsRow } from "./NewsCard";
import { SectionHeading } from "./SectionHeading";

/** «Жизнь уммы» (эталон .news): главная новость + список с миниатюрами. */
export async function UmmahLife() {
  const news = await getLatestNews(5);
  const [featured, ...rest] = news;

  return (
    <section aria-labelledby="umma-title" className="container-site pt-10 md:pt-20">
      <SectionHeading
        id="umma-title"
        label="Новости · видео · фото"
        title="Жизнь"
        accent="уммы"
        action={
          news.length > 0 && (
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
          )
        }
      />

      {!featured ? (
        <EmptyState title="Новостей пока нет" sky="dawn">
          Здесь будут новости муфтията и общин области, обращения, видео и фотографии с мероприятий.
        </EmptyState>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-7">
          <FeaturedNews item={featured} />

          <ul>
            {rest.map((n) => (
              <li key={n.slug} className="border-b border-line py-3.5">
                <NewsRow item={n} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
