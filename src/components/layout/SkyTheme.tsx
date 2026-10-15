"use client";

import { useApplySky, useSkyClock } from "@/lib/prayer/useSkyClock";

/** Тема внутренних страниц следует за небом по времени намаза, как на главной (без картинки неба). */
export function SkyTheme() {
  useApplySky(useSkyClock()?.sky);
  return null;
}
