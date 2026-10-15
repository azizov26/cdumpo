"use client";

import { useEffect } from "react";

/** Подключает сервис-воркер (только в продакшене) и отдаёт ему файлы сборки, уже загруженные страницей, для работы без сети. */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const run = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        const sw = (await navigator.serviceWorker.ready).active ?? reg.active;
        const urls = performance
          .getEntriesByType("resource")
          .map((r) => new URL(r.name, location.href))
          .filter((u) => u.origin === location.origin && u.pathname.startsWith("/_next/static/"))
          .map((u) => u.pathname + u.search);
        sw?.postMessage({ type: "cache", urls });
      } catch {
        // Без сервис-воркера сайт работает как обычно.
      }
    };
    if (document.readyState === "complete") void run();
    else window.addEventListener("load", () => void run(), { once: true });
  }, []);
  return null;
}
