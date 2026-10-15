import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
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
      <div className="container-site flex flex-wrap gap-3 pt-6">
        <Button href="/namaz/kibla">
          <Icon name="arrow-right" />
          Кибла
        </Button>
        <Button href="/namaz/kalendar">
          <Icon name="arrow-right" />
          Календарь хиджры
        </Button>
      </div>
      <NamazDay />
      <div className="pb-20 md:pb-28">
        <PrayerMonth />
      </div>
    </>
  );
}
