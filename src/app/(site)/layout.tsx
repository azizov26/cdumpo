import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource/amiri/arabic-400.css";
import "../globals.css";
import { PwaRegister } from "@/components/layout/PwaRegister";
import { Suspense } from "react";
import { PrayerTableLoader } from "@/components/layout/PrayerTableLoader";
import { YandexMetrika } from "@/components/layout/YandexMetrika";
import { SITE_FULL_NAME, SITE_NAME, SITE_URL, YANDEX_VERIFICATION } from "@/lib/site";

const DESCRIPTION =
  "Время намаза в Пензе, новости мусульманской уммы Пензенской области, строительство Соборной мечети Пензы. Официальный сайт ЦДУМ ПО.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_FULL_NAME}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_FULL_NAME}`,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} — Небо над Пензой` }],
  },
  twitter: { card: "summary_large_image" },
  verification: { yandex: YANDEX_VERIFICATION },
};

// Разметка организации — только подтверждённые факты (PRODUCT.md).
const organizationLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_FULL_NAME,
  alternateName: [SITE_NAME, "Муфтият Пензы"],
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Пенза",
    streetAddress: "ул. Бакунина, 10",
    addressCountry: "RU",
  },
}).replace(/</g, "\\u003c");

export const viewport: Viewport = {
  themeColor: "#0b1636",
  viewportFit: "cover",
};

// Грубая оценка неба по часу до гидратации, чтобы не было вспышки не той темы.
// Точное состояние по времени намаза выставляет useApplySky на клиенте. Здесь же — решение о заставке «Бисмиллях».
const earlySky = `(function(){try{
var q=new URLSearchParams(location.search).get("sky");
var h=new Date().getHours();
var s=q||(h<5?"night":h<7?"dawn":h<14?"day":h<16?"asr":h<19?"evening":"night");
var d=document.documentElement;d.dataset.sky=s;
d.dataset.theme=(s==="day"||s==="asr")?"light":"dark";
var rm=matchMedia("(prefers-reduced-motion: reduce)").matches,seen=null;
try{seen=sessionStorage.getItem("intro");sessionStorage.setItem("intro","1");}catch(e){}
d.dataset.intro=(rm||seen)?"skip":"play";
if(seen)d.dataset.revealed="1";
var sd=navigator.connection&&navigator.connection.saveData;
d.dataset.motion=(rm||sd)?"0":((navigator.deviceMemory||4)>=4&&(navigator.hardwareConcurrency||4)>=6)?"2":"1";
}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" data-sky="night" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlySky }} />
      </head>
      <body>
        <Suspense fallback={null}>
          <PrayerTableLoader />
        </Suspense>
        {children}
        <YandexMetrika />
        <PwaRegister />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationLd }} />
      </body>
    </html>
  );
}
