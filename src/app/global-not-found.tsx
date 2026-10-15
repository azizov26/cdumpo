import type { Metadata } from "next";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource/amiri/arabic-400.css";
import "./globals.css";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = { title: "Страница не найдена", robots: { index: false } };

// Два корневых layout (сайт и админка) — для неизвестных адресов нужна своя страница со своим <html>.
export default function GlobalNotFound() {
  return (
    <html lang="ru" data-sky="night" data-theme="dark" data-motion="0" data-intro="skip" data-revealed="1">
      <body>
        <NotFoundContent />
      </body>
    </html>
  );
}
