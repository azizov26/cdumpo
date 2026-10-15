import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";

const actions: { href: string; label: string; icon: IconName; give?: boolean }[] = [
  { href: "/mosques", label: "Мечети рядом", icon: "mosques" },
  { href: "/vopros-imamu", label: "Вопрос имаму", icon: "ask-imam" },
  { href: "/obryady", label: "Обряды и запись", icon: "rites" },
  { href: "/dobro", label: "Садака и закят", icon: "sadaqa", give: true },
];

/** Четыре действия в одно касание (телефон; на компьютере они в нижнем ряду неба). */
export function QuickActions() {
  return (
    <nav aria-label="Быстрые действия" className="container-site pt-5 md:hidden">
      <ul className="grid grid-cols-2 gap-2.5">
        {actions.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className={`flex min-h-[64px] flex-col justify-center gap-1.5 rounded-card border bg-surface px-4 py-3 text-[14px] leading-tight font-semibold ${
                a.give ? "border-zarya/60" : "border-line"
              }`}
            >
              <Icon name={a.icon} className="size-5 text-accent" />
              {a.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
