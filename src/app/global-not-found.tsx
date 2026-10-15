import type { Metadata } from "next";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource/amiri/arabic-400.css";
import "./globals.css";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/layout/PageHeading";

export const metadata: Metadata = { title: "Страница не найдена", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="ru" data-sky="night" data-theme="dark" data-motion="0" data-intro="skip" data-revealed="1">
      <body>
        <PageShell>
          <PageHeading
            title="Страница не найдена"
            lead="Возможно, ссылка устарела: сайт обновился, и адреса некоторых страниц изменились."
          />
          <div className="container-site pt-8 pb-20 md:pt-10 md:pb-28">
            <EmptyState
              title="Такой страницы нет"
              sky="night"
              action={
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    href="/"
                    variant="night"
                    className="[[data-theme=dark]_&]:bg-light [[data-theme=dark]_&]:text-night"
                  >
                    На главную
                  </Button>
                  <Button href="/eshchyo">Все разделы</Button>
                </div>
              }
            >
              Проверьте адрес или начните с главной — там время намаза, новости и контакты муфтията.
            </EmptyState>
          </div>
        </PageShell>
      </body>
    </html>
  );
}
