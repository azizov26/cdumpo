import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { sectionByPath } from "@/lib/site";
import { PageHeading } from "./PageHeading";

// Заглушка раздела, который ещё не сверстан. Каждому разделу — свой page.tsx из трёх строк:
// когда раздел будет готов, файл заменяется настоящей страницей, а в реестре (lib/site.ts) ставится ready: true.

const need = (path: string) => {
  const s = sectionByPath(path);
  if (!s) throw new Error(`Нет раздела ${path} в реестре lib/site.ts`);
  return s;
};

export function comingSoonMetadata(path: string): Metadata {
  const s = need(path);
  // Пустые страницы поисковикам не нужны: индексировать начнём, когда появится содержание.
  return { title: s.title, description: s.about, robots: { index: false, follow: true } };
}

export function ComingSoon({ path }: { path: string }) {
  const section = need(path);
  const parentPath = path.split("/").slice(0, -1).join("/");
  const parent = parentPath ? sectionByPath(parentPath) : undefined;

  return (
    <>
      <PageHeading title={section.title}>
        {parent && (
          <Link
            href={parent.href}
            className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-accent"
          >
            <Icon name="arrow-right" className="size-[18px] rotate-180" />
            {parent.title}
          </Link>
        )}
      </PageHeading>
      <div className="container-site pt-8 pb-20 md:pt-10 md:pb-28">
        <EmptyState
          title="Раздел готовится"
          sky="dawn"
          action={
            <div className="flex flex-wrap gap-2.5">
              <Button
                href="/"
                variant="night"
                className="[[data-theme=dark]_&]:bg-light [[data-theme=dark]_&]:text-night"
              >
                На главную
              </Button>
              <Button href="/#namaz-month">Время намаза на месяц</Button>
            </div>
          }
        >
          {section.about} Мы собираем материалы вместе с муфтиятом — здесь появится настоящее содержание, без заглушек.
        </EmptyState>
      </div>
    </>
  );
}
