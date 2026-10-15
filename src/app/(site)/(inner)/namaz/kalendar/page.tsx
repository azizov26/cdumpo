import type { Metadata } from "next";
import { HijriCalendar } from "@/components/calendar/HijriCalendar";
import { PageHeading } from "@/components/layout/PageHeading";

export const metadata: Metadata = {
  title: "Календарь хиджры",
  description:
    "Календарь хиджры: даты по лунному календарю, памятные дни и праздники. Приблизительные даты помечены «≈».",
  alternates: { canonical: "/namaz/kalendar" },
};

export default function CalendarPage() {
  return (
    <>
      <PageHeading
        title="Календарь хиджры"
        lead="Месяц по обоим календарям, памятные даты и праздники на год вперёд."
      />
      <div className="container-site pt-8 pb-20 md:pt-12 md:pb-28">
        <HijriCalendar />
      </div>
    </>
  );
}
