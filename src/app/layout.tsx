import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource/amiri/arabic-400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ЦДУМ ПО — Централизованное духовное управление мусульман Пензенской области",
    template: "%s — ЦДУМ ПО",
  },
  description:
    "Новости мусульманской уммы Пензенской области, время намаза, строительство Соборной мечети Пензы.",
};

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
}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" data-sky="night" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlySky }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
