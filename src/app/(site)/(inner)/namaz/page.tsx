import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { NamazDay } from "@/components/sections/NamazDay";
import { PrayerMonth } from "@/components/sections/PrayerMonth";

export const metadata: Metadata = {
  title: "Время намаза в Пензе",
  description:
    "Время намаза в Пензе на сегодня, неделю и месяц: фаджр, восход, зухр, аср, магриб и иша. Расписание ЦДУМ ПО.",
  alternates: { canonical: "/namaz" },
};

export default function NamazPage() {
  return (
    <>
      <PageHeading title="Время намаза" lead="Расписание для Пензы: сегодня, неделя и весь месяц." />
      <NamazDay />
      <div className="pb-20 md:pb-28">
        <PrayerMonth />
      </div>
    </>
  );
}
