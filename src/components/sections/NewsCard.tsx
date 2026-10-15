import Image from "next/image";
import Link from "next/link";
import { SkyPicture } from "@/components/sky/SkyGraphic";
import { Chip } from "@/components/ui/Tag";
import type { NewsItem } from "@/lib/content/news";

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", timeZone: "Europe/Moscow" });

export function Cover({ item, width, height, className }: { item: NewsItem; width: number; height: number; className: string }) {
  // Реальные фото — когда появятся в админке; до этого — фирменная заглушка-небо.
  if (item.cover) {
    return <Image src={item.cover.src} alt={item.cover.alt} width={width} height={height} className={`${className} object-cover`} />;
  }
  return <SkyPicture sky={item.placeholderSky ?? "dawn"} width={width} height={height} className={className} />;
}

function Meta({ item }: { item: NewsItem }) {
  return (
    <p className="flex items-center gap-2.5 text-[12.5px] text-fg-2">
      <Chip>{item.rubric}</Chip>
      <time dateTime={item.date}>{shortDate(item.date)}</time>
    </p>
  );
}

/** Главная новость: большая обложка 16:10, заголовок до трёх строк. Вся карточка — одна ссылка. */
export function FeaturedNews({ item }: { item: NewsItem }) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-line bg-surface">
      <Cover item={item} width={640} height={400} className="h-[200px] w-full md:h-[320px]" />
      <div className="px-5 pt-5 pb-6 md:px-7 md:pt-6 md:pb-7">
        <Meta item={item} />
        <h3 className="mt-1.5 font-display text-[24px] leading-[1.12] font-semibold md:text-[32px]">
          <Link href={`/umma/${item.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
            {item.title}
          </Link>
        </h3>
        {item.lead && <p className="mt-2.5 line-clamp-3 text-[15px] leading-[1.55] text-fg-2">{item.lead}</p>}
      </div>
    </article>
  );
}

/** Новость строкой: миниатюра, рубрика и дата, заголовок. */
export function NewsRow({ item }: { item: NewsItem }) {
  return (
    <article className="group relative grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[120px_1fr]">
      <Cover item={item} width={240} height={168} className="h-[68px] w-full rounded-m md:h-[84px]" />
      <div>
        <Meta item={item} />
        <h3 className="mt-1.5 font-display text-[19px] leading-[1.12] font-semibold md:text-[21px]">
          <Link href={`/umma/${item.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
            {item.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
