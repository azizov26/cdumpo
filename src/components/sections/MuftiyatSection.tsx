import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Soon } from "@/components/ui/Tag";
import { SectionHeading } from "./SectionHeading";

// «Муфтият» — второй экран вместе с «Жизнью уммы» (решение заказчика, см. PRODUCT.md).
// Факты — только из PRODUCT.md; всё остальное — явные заглушки.

const LINKS: { href: string; title: string; icon: IconName; body: React.ReactNode }[] = [
  { href: "/muftiyat/istoriya", title: "История и миссия", icon: "book", body: <Soon>Раздел готовится</Soon> },
  { href: "/muftiyat/struktura", title: "Структура и имамы", icon: "users", body: <Soon>Раздел готовится</Soon> },
  { href: "/muftiyat/dokumenty", title: "Документы", icon: "download", body: <Soon>Раздел готовится</Soon> },
  {
    href: "/muftiyat/kontakty",
    title: "Контакты и СМИ",
    icon: "phone",
    body: <>г. Пенза, ул. Бакунина, 10</>,
  },
];

export function MuftiyatSection() {
  return (
    <section aria-labelledby="muftiyat-title" className="container-site pt-14 md:pt-24">
      <SectionHeading id="muftiyat-title" label="Муфтият" title="О" accent="ЦДУМ ПО" />
      <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:gap-7">
        <div>
          <p className="max-w-[62ch] text-[15px] leading-[1.55] text-fg-2 md:text-[17px]">
            Централизованное духовное управление мусульман Пензенской области — муфтият Пензы. Обращения муфтия,
            структура управления, документы и контакты для прихожан, СМИ и партнёров. Главный проект сейчас —
            строительство Соборной мечети Пензы.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex h-full flex-col gap-3 rounded-card border border-line bg-surface p-5 shadow-card transition-colors hover:border-fg-3"
                >
                  <span className="flex items-center justify-between">
                    <Icon name={l.icon} className="size-[22px] text-accent" />
                    <Icon
                      name="arrow-right"
                      className="size-[18px] text-fg-3 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                  <span className="text-[15.5px] font-semibold">{l.title}</span>
                  <span className="text-[13px] leading-[1.45] text-fg-2">{l.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Карточка муфтия — ночная в обеих темах, как панель Соборной мечети. */}
        <aside
          data-theme="dark"
          aria-label="Муфтий"
          className="flex flex-col overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_70%_20%,#1B2658_0%,#0B1636_70%)] text-light"
        >
          <div
            role="img"
            aria-label="Фото муфтия появится позже"
            className="flex h-[220px] items-end justify-center bg-[linear-gradient(170deg,#3D2D5E,#D9805A_70%,#F2B57C)] pb-4 text-[13px] text-light/70"
          >
            фото муфтия
          </div>
          <div className="flex flex-1 flex-col p-6">
            <p className="eyebrow">Муфтий</p>
            <p className="mt-2 font-display text-[30px] leading-[1.05] font-medium">Асият-хазрат Уразаев</p>
            <div className="mt-4 border-t border-light/12 pt-4 text-[14.5px]">
              <Soon>Обращения муфтия появятся здесь</Soon>
            </div>
            <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
              <Button href="/muftiyat">О муфтияте</Button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
