"use client";

import { setPrayerDays } from "@/lib/prayer/times";

/** Подставляет расписание из админки до отрисовки виджетов намаза (сервер и клиент). Ничего не рисует. */
export function PrayerTableSeed({ days }: { days: Record<string, string> | null }) {
  setPrayerDays(days);
  return null;
}
