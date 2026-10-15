import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanitizeLegacyHtml } from "@/lib/sanitize/legacyHtml";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Cover } from "@/components/sections/NewsCard";
import { ShareLinks } from "@/components/sections/ShareLinks";
import { Icon } from "@/components/ui/Icon";
import { Chip } from "@/components/ui/Tag";
import { formatNewsDate, getLatestNews, getNewsBySlug } from "@/lib/content/news";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = (await getLatestNews()).map((n) => ({ slug: n.slug }));
  // Cache Components требует хотя бы один адрес при сборке. Пока новостей нет — служебный «_»:
  // он уходит в notFound() ещё при сборке и остаётся статичной страницей 404.
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/umma/[slug]">): Promise<Metadata> {
  const item = await getNewsBySlug((await params).slug);
  if (!item) return {};
  const url = `/umma/${item.slug}`;
  return {
    title: item.title,
    description: item.lead,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.lead,
      url,
      publishedTime: item.date,
      ...(item.cover && { images: [item.cover.src] }),
    },
  };
}

// Новости, опубликованные после сборки, рендерятся по запросу (оболочка страницы готова заранее).
// Несуществующий адрес показывает «не найдено» с noindex; код ответа при этом 200 — так устроен частичный пререндер.
export const instant = false;

export default async function NewsPage({ params }: PageProps<"/umma/[slug]">) {
  const item = await getNewsBySlug((await params).slug);
  if (!item) notFound();

  return (
    <article className="container-site pt-8 pb-20 md:pt-12 md:pb-28">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/umma"
          className="inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-accent"
        >
          <Icon name="arrow-right" className="size-[18px] rotate-180" />
          Жизнь уммы
        </Link>
        <p className="mt-3 flex items-center gap-2.5 text-[13px] text-fg-2">
          <Chip>{item.rubric}</Chip>
          <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
        </p>
        <h1 className="mt-3 font-display text-[36px] leading-[1.05] font-medium md:text-[56px]">{item.title}</h1>
        {item.lead && <p className="mt-5 text-[19px] leading-[1.55] text-fg-2">{item.lead}</p>}
        <Cover item={item} width={1200} height={750} className="mt-8 h-[220px] w-full rounded-[24px] md:h-[420px]" />
        {item.body ? (
          <RichText data={item.body} className="news-body mt-8 text-[17px] leading-[1.7] md:text-[18px]" />
        ) : (
          item.legacyHtml && (
            <div
              className="news-body mt-8 text-[17px] leading-[1.7] md:text-[18px]"
              dangerouslySetInnerHTML={{ __html: sanitizeLegacyHtml(item.legacyHtml) }}
            />
          )
        )}
        <div className="mt-10 border-t border-line pt-6">
          <ShareLinks url={`${SITE_URL}/umma/${item.slug}`} title={item.title} />
        </div>
      </div>
    </article>
  );
}
