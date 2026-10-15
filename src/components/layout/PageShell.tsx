import type { ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { MobileTabBar } from "@/components/sections/MobileTabBar";
import { SiteHeader } from "./SiteHeader";
import { SkyTheme } from "./SkyTheme";

/** Общая оболочка внутренних страниц и страницы 404: шапка, содержимое, подвал, нижняя панель. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkyTheme />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Перейти к содержанию
      </a>
      <SiteHeader />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
