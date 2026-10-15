import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { FactList, Pending } from "@/components/sections/FactList";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Suspense } from "react";
import { getSiteSettings } from "@/lib/content/settings";
import { SITE_ADDRESS, SITE_FULL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты и СМИ",
  description: `Контакты ЦДУМ ПО: адрес — ${SITE_ADDRESS}, как проехать, связь для прихожан и журналистов.`,
  alternates: { canonical: "/muftiyat/kontakty" },
};

// Адрес известен (PRODUCT.md). Телефоны, почта и соцсети — от муфтията: до этого видно, чего не хватает.
const ROUTE = `https://yandex.ru/maps/?text=${encodeURIComponent("Пенза, улица Бакунина, 10")}`;

const link = (href: string, label: string) => (
  <a href={href} className="font-semibold text-accent underline underline-offset-4">
    {label}
  </a>
);

// Данные приходят из «Настроек сайта» в админке; пока поле пустое — пометка [уточнить: …].
async function ContactFacts() {
  const s = await getSiteSettings();
  const tel = s.phone?.replace(/[^\d+]/g, "");
  const social = (url: string | undefined, what: string) =>
    url ? link(url, url.replace(/^https?:\/\//, "")) : <Pending what={what} />;
  return (
    <FactList
      items={[
        { term: "Организация", value: SITE_FULL_NAME },
        { term: "Адрес", value: <address className="not-italic">{SITE_ADDRESS}</address> },
        {
          term: "Телефон приёмной",
          value: s.phone ? link(`tel:${tel}`, s.phone) : <Pending what="телефон приёмной" />,
        },
        {
          term: "Электронная почта",
          value: s.email ? link(`mailto:${s.email}`, s.email) : <Pending what="адрес электронной почты" />,
        },
        { term: "Режим работы", value: s.hours ?? <Pending what="часы приёма" /> },
        { term: "Telegram", value: social(s.telegram, "ссылка на канал") },
        { term: "ВКонтакте", value: social(s.vk, "ссылка на сообщество") },
        { term: "Для СМИ", value: s.pressContact ?? <Pending what="контакт для журналистов" /> },
      ]}
    />
  );
}

export default function ContactsPage() {
  return (
    <>
      <PageHeading title="Контакты и СМИ" lead="Как найти и связаться с муфтиятом." />
      <div className="container-site pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="max-w-[860px]">
          <Suspense fallback={<div className="min-h-[420px]" aria-busy="true" />}>
            <ContactFacts />
          </Suspense>
          <div className="mt-6">
            <Button
              href={ROUTE}
              variant="night"
              className="[[data-theme=dark]_&]:bg-light [[data-theme=dark]_&]:text-night"
            >
              <Icon name="arrow-right" />
              Как проехать
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
