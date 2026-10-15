import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const isProd = process.env.NODE_ENV === "production";

// Политика содержимого публичного сайта (PRODUCT.md → «Защита»). Инлайн-скрипты нужны раннему скрипту темы
// и Метрике, поэтому 'unsafe-inline' для скриптов; всё остальное — только свои источники и перечисленные внешние.
// Видео в новостях — плееры Rutube, VK и YouTube (без cookie). Домен S3-хранилища добавить, когда он будет известен.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://mc.yandex.com${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://mc.yandex.ru https://mc.yandex.com",
  "font-src 'self' data:",
  `connect-src 'self' https://mc.yandex.ru https://mc.yandex.com wss://mc.yandex.ru${isProd ? "" : " ws: wss:"}`,
  "frame-src https://mc.yandex.ru https://mc.yandex.com https://rutube.ru https://vk.com https://vkvideo.ru https://www.youtube-nocookie.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  // Геолокацию отдаём только своему сайту (кибла-компас); камера, микрофон и платежи не нужны.
  { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=(), usb=()" },
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: baseHeaders },
      // Сервис-воркер всегда проверяется заново — иначе обновление сайта не дойдёт до установленных копий.
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }] },
      // Админка Payload и её API ведут себя иначе (свои скрипты и стили), строгая политика — только на публичных страницах.
      { source: "/((?!admin|api).*)", headers: [{ key: "Content-Security-Policy", value: csp }] },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Два корневых layout (сайт и Payload) — единой 404 больше нет, нужна глобальная.
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withPayload(nextConfig);
