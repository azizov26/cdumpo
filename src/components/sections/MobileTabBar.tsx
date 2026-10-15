import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";

const tabs: { href: string; label: string; icon: IconName; dobro?: boolean }[] = [
  { href: "/", label: "Сегодня", icon: "today" },
  { href: "/namaz", label: "Намаз", icon: "namaz" },
  { href: "/mosques", label: "Мечети", icon: "mosques" },
  { href: "/dobro", label: "Добро", icon: "dobro", dobro: true },
  { href: "/eshchyo", label: "Ещё", icon: "more" },
];

/** Нижняя панель (эталон .tabbar): 84 px вместе с зоной home-indicator. */
export function MobileTabBar({ current }: { current: string }) {
  return (
    <nav
      aria-label="Разделы"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--tab-line)] bg-[color:var(--tab-bg)] pb-[max(env(safe-area-inset-bottom),8px)] md:hidden"
    >
      <ul className="grid grid-cols-5 px-1.5 pt-2">
        {tabs.map((t) => {
          const on = current === t.href;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-[50px] flex-col items-center justify-center gap-1 text-[10.5px] font-semibold ${
                  on ? "text-[color:var(--tab-on)]" : t.dobro ? "text-[color:var(--tab-don)]" : "text-[color:var(--tab-fg)]"
                }`}
              >
                <Icon name={t.icon} className="size-[22px]" />
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
