import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { Icon } from "@/components/ui/Icon";
import { MORE_GROUPS, sectionByPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ещё",
  description: "Все разделы сайта ЦДУМ ПО: жизнь общины, добрые дела, муфтият и контакты.",
};

/** Экран «Ещё» — меню разделов, которых нет в нижней панели. */
export default function MorePage() {
  return (
    <>
      <PageHeading title="Ещё" lead="Все разделы сайта в одном месте." />
      <div className="container-site grid gap-10 pt-8 pb-20 md:grid-cols-3 md:gap-8 md:pt-12 md:pb-28">
        {MORE_GROUPS.map((group) => (
          <section key={group.title} aria-labelledby={`more-${group.hrefs[0]}`}>
            <h2 id={`more-${group.hrefs[0]}`} className="eyebrow mb-3">
              {group.title}
            </h2>
            <ul className="overflow-hidden rounded-card border border-line bg-surface">
              {group.hrefs.map((href) => {
                const s = sectionByPath(href)!;
                return (
                  <li key={href} className="border-b border-line last:border-b-0">
                    <Link
                      href={href}
                      className="flex min-h-14 items-center justify-between gap-3 px-5 py-3 text-[16px] font-semibold transition-colors duration-150 hover:bg-[color:var(--row-friday)]"
                    >
                      {s.title}
                      <Icon name="arrow-right" className="size-[18px] shrink-0 text-accent" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
