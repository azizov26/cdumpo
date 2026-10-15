"use client";

import { useEffect } from "react";
import {
  getDayTimes,
  getNext,
  getSkyState,
  isSkyState,
  themeOf,
  type DayTimes,
  type PrayerKey,
  type SkyState,
} from "./times";
import { useNow } from "./useNow";

export type SkyClock = {
  now: Date;
  times: DayTimes;
  sky: SkyState;
  next: { key: PrayerKey; at: Date };
};

// Предпросмотр состояний неба для макета: ?sky=dawn|day|asr|evening|night.
// Время сдвигается внутрь выбранного состояния, чтобы отсчёт и строка намазов совпадали с небом.
let offsetMs: number | null = null;

function previewOffset(real: Date): number {
  if (offsetMs !== null) return offsetMs;
  const q = new URLSearchParams(window.location.search).get("sky");
  offsetMs = 0;
  if (isSkyState(q)) {
    const t = getDayTimes(real);
    const mid = (a: Date, b: Date) => (a.getTime() + b.getTime()) / 2;
    const target: Record<SkyState, number> = {
      dawn: mid(t.fajr, t.sunrise),
      day: t.dhuhr.getTime() + 47 * 60_000,
      asr: mid(t.asr, new Date(t.maghrib.getTime() - 3_600_000)),
      evening: t.maghrib.getTime() - 45 * 60_000,
      night: t.isha.getTime() + 2 * 3_600_000,
    };
    offsetMs = target[q] - real.getTime();
  }
  return offsetMs;
}

export function useSkyClock(): SkyClock | null {
  const real = useNow();
  if (!real) return null;
  const now = new Date(real.getTime() + previewOffset(real));
  const times = getDayTimes(now);
  const sky = getSkyState(now, times);
  // На рассвете концепция показывает отсчёт до восхода — конец времени фаджра.
  const next = sky === "dawn" ? { key: "sunrise" as const, at: times.sunrise } : getNext(now, times);
  return { now, times, sky, next };
}

/** Выставляет data-sky и data-theme на <html> по текущему состоянию неба. */
export function useApplySky(sky: SkyState | undefined) {
  useEffect(() => {
    if (!sky) return;
    const html = document.documentElement;
    html.dataset.sky = sky;
    if (!html.dataset.themeLocked) html.dataset.theme = themeOf(sky);
  }, [sky]);
}
