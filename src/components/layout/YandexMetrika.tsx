"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { METRIKA_ID } from "@/lib/site";

type Ym = (id: number, method: string, ...args: unknown[]) => void;

// Счётчик старого сайта сохранён (PRODUCT.md), чтобы не потерять статистику.
// Работает только в продакшене. Вебвизор выключен: запись сессий — отдельное решение
// вместе с политикой персональных данных (152-ФЗ).
// defer:true — первый просмотр отправляет эффект ниже, поэтому переходы без перезагрузки считаются так же.
const init = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${METRIKA_ID},"init",{defer:true,clickmap:true,trackLinks:true,accurateTrackBounce:true});`;

export function YandexMetrika() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    (window as unknown as { ym?: Ym }).ym?.(METRIKA_ID, "hit", location.href);
  }, [pathname]);

  if (process.env.NODE_ENV !== "production") return null;
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: init }} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- пиксель счётчика для браузеров без JavaScript */}
        <img
          src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </noscript>
    </>
  );
}
