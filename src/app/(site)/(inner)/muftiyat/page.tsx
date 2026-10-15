import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { FactList } from "@/components/sections/FactList";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SITE_ADDRESS, SITE_FULL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "О ЦДУМ ПО — муфтият Пензы",
  description: "Централизованное духовное управление мусульман Пензенской области: муфтий, структура, документы и контакты.",
  alternates: { canonical: "/muftiyat" },
};

const SECTIONS: { href: string; title: string; text: string; icon: IconName }[] = [
  { href: "/muftiyat/istoriya", title: "История и миссия", text: "Как возникло управление и чем оно занимается.", icon: "book" },
  { href: "/muftiyat/struktura", title: "Структура и имамы", text: "Устройство управления и имамы мечетей области.", icon: "users" },
  { href: "/muftiyat/dokumenty", title: "Документы", text: "Официальные документы муфтията.", icon: "download" },
  { href: "/muftiyat/kontakty", title: "Контакты и СМИ", text: "Адрес, как проехать, связь для прихожан и журналистов.", icon: "phone" },
];

export default function MuftiyatPage() {
  return (
    <>
      <PageHeading
        title="О ЦДУМ ПО"
        lead="Муфтият Пензы объединяет мусульманские общины области. Здесь — всё об управлении: муфтий, структура, документы и контакты."
      />
      <div className="container-site grid gap-10 pt-8 pb-20 md:pt-12 md:pb-28 lg:grid-cols-[1fr_380px] lg:gap-14">
        <div className="space-y-8">
          <FactList
            items={[
              { term: "Полное название", value: SITE_FULL_NAME },
              { term: "Сокращённо", value: "ЦДУМ ПО, «Муфтият Пензы»" },
              { term: "Муфтий", value: "Уразаев Асият Джафарович (Асият-хазрат Уразаев)" },
              { term: "Адрес", value: SITE_ADDRESS },
              {
                term: "Главный проект",
                value: (
                  <>
                    Строительство Соборной мечети г. Пензы на проспекте Победы.{" "}
                    <Link href="/dobro" className="font-semibold text-accent">
                      О проекте
                    </Link>
                  </>
                ),
              },
            ]}
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col gap-3 rounded-card border border-line bg-surface p-5 transition-colors hover:border-fg-3"
                >
                  <span className="flex items-center justify-between">
                    <Icon name={s.icon} className="size-[22px] text-accent" />
                    <Icon name="arrow-right" className="size-[18px] text-fg-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  <span className="text-[16px] font-semibold">{s.title}</span>
                  <span className="text-[14px] leading-[1.45] text-fg-2">{s.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <aside
          data-theme="dark"
          aria-label="Муфтий"
          className="h-fit overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_70%_20%,#1B2658_0%,#0B1636_70%)] text-light"
        >
          <div
            role="img"
            aria-label="Фото муфтия появится позже"
            className="flex h-[220px] items-end justify-center bg-[linear-gradient(170deg,#3D2D5E,#D9805A_70%,#F2B57C)] pb-4 text-[13px] text-light/70"
          >
            фото муфтия
          </div>
          <div className="p-6">
            <p className="eyebrow">Муфтий</p>
            <p className="mt-2 font-display text-[30px] leading-[1.05] font-medium">Асият-хазрат Уразаев</p>
            <p className="mt-4 border-t border-light/12 pt-4 text-[14.5px] text-light/78">
              Биография и обращения муфтия появятся здесь, когда муфтият передаст материалы.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
