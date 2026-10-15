import { SITE_URL } from "@/lib/site";

const isProd = process.env.NODE_ENV === "production";
// Во время `next build` секретов нет и не нужно: страницы админки рендерятся по запросу.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

/** Секрет подписи сессий. В продакшене без нормального секрета приложение не запускается. */
export function payloadSecret(): string {
  const secret = process.env.PAYLOAD_SECRET ?? "";
  if (isProd && !isBuildPhase && secret.length < 32) {
    throw new Error("PAYLOAD_SECRET не задан или короче 32 символов. Сгенерируйте: openssl rand -hex 32");
  }
  return secret;
}

/** Адреса, с которых админке можно слать запросы с cookie: сам сайт (и локальный сервер в разработке). */
export const allowedOrigins: string[] = [
  SITE_URL,
  ...(isProd ? [] : ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"]),
];

/** Настройки входа сотрудников: блокировка подбора, короткая сессия, защищённые cookie. */
export const staffAuth = {
  maxLoginAttempts: 5,
  lockTime: 15 * 60 * 1000,
  tokenExpiration: 8 * 60 * 60,
  cookies: { secure: isProd, sameSite: "Strict" as const },
};

/** Предел размера загружаемого файла, байт. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
