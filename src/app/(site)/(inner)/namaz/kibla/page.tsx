import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { QiblaCompass } from "@/components/qibla/QiblaCompass";

export const metadata: Metadata = {
  title: "Кибла: направление на Каабу",
  description:
    "Кибла-компас: направление на Каабу в градусах и сторонах света и расстояние до Мекки из Пензы или вашего места.",
  alternates: { canonical: "/namaz/kibla" },
};

export default function QiblaPage() {
  return (
    <>
      <PageHeading
        title="Кибла"
        lead="Направление на Каабу из вашего места: в градусах, по сторонам света и по компасу телефона."
      />
      <div className="container-site pt-8 pb-20 md:pt-12 md:pb-28">
        <QiblaCompass />
      </div>
    </>
  );
}
