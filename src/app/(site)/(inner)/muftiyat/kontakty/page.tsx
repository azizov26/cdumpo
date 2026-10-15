import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { FactList, Pending } from "@/components/sections/FactList";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SITE_ADDRESS, SITE_FULL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты и СМИ",
  description: `Контакты ЦДУМ ПО: адрес — ${SITE_ADDRESS}, как проехать, связь для прихожан и журналистов.`,
  alternates: { canonical: "/muftiyat/kontakty" },
};

// Адрес известен (PRODUCT.md). Телефоны, почта и соцсети — от муфтията: до этого видно, чего не хватает.
const ROUTE = `https://yandex.ru/maps/?text=${encodeURIComponent("Пенза, улица Бакунина, 10")}`;

export default function ContactsPage() {
  return (
    <>
      <PageHeading title="Контакты и СМИ" lead="Как найти и связаться с муфтиятом." />
      <div className="container-site pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="max-w-[860px]">
          <FactList
            items={[
              { term: "Организация", value: SITE_FULL_NAME },
              {
                term: "Адрес",
                value: (
                  <address className="not-italic">
                    {SITE_ADDRESS}
                  </address>
                ),
              },
              { term: "Телефон приёмной", value: <Pending what="телефон приёмной" /> },
              { term: "Электронная почта", value: <Pending what="адрес электронной почты" /> },
              { term: "Режим работы", value: <Pending what="часы приёма" /> },
              { term: "Telegram", value: <Pending what="ссылка на канал" /> },
              { term: "ВКонтакте", value: <Pending what="ссылка на сообщество" /> },
              { term: "Для СМИ", value: <Pending what="контакт для журналистов" /> },
            ]}
          />
          <div className="mt-6">
            <Button href={ROUTE} variant="night" className="[[data-theme=dark]_&]:bg-light [[data-theme=dark]_&]:text-night">
              <Icon name="arrow-right" />
              Как проехать
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
