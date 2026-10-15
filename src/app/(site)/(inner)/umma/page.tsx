import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { NewsFeed } from "@/components/sections/NewsFeed";
import { getLatestNews } from "@/lib/content/news";

export const metadata: Metadata = {
  title: "Жизнь уммы — новости",
  description:
    "Новости муфтията и мусульманских общин Пензенской области, обращения, видео и фотографии с мероприятий.",
  alternates: { canonical: "/umma" },
};

export default async function UmmaPage() {
  const items = await getLatestNews();
  return (
    <>
      <PageHeading title="Жизнь уммы" lead="Новости муфтията и общин области, видео и фотографии с мероприятий." />
      <div className="container-site pt-8 pb-20 md:pt-10 md:pb-28">
        <NewsFeed items={items} />
      </div>
    </>
  );
}
