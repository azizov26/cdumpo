"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { isActive, NAV } from "@/lib/site";

/** Шапка внутренних страниц: логотип, разделы, «Положить камень». На главной шапка живёт внутри неба. */
export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/92 pt-[env(safe-area-inset-top)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-[64px] max-w-[1328px] items-center justify-between gap-6 px-5 md:h-[76px] md:px-10 xl:px-14">
        <Link href="/" aria-label="ЦДУМ ПО — на главную" className="flex min-h-11 items-center gap-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-line md:size-11">
            <Image src="/brand/logo.png" alt="" width={76} height={72} className="w-[32px] md:w-[36px]" priority />
          </span>
          <span className="text-[12px] leading-[1.25] font-semibold md:text-[13px]">
            <span className="md:hidden">
              ЦДУМ
              <br />
              Пензенской области
            </span>
            <span className="max-md:hidden">
              Централизованное духовное управление
              <br />
              мусульман Пензенской области
            </span>
          </span>
        </Link>

        <nav aria-label="Основное меню" className="hidden xl:block">
          <ul className="flex gap-[30px] text-[15px] font-medium">
            {NAV.map((n) => {
              const on = isActive(n.href, pathname);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={on ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center border-b-2 transition-colors duration-150 ${
                      on ? "border-accent text-accent" : "border-transparent text-fg-2 hover:text-fg"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/dobro"
          className="hidden h-[46px] items-center gap-2 rounded-full bg-zarya px-[22px] text-[14.5px] font-bold text-on-gold transition-transform duration-150 ease-out active:scale-[0.97] md:inline-flex"
        >
          <Icon name="stones" className="size-[18px]" />
          Положить камень
        </Link>
      </div>
    </header>
  );
}
