"use client";

import { useEffect, useState } from "react";
import { formatTime, PRAYER_NAMES } from "@/lib/prayer/times";
import { useSkyClock } from "@/lib/prayer/useSkyClock";
import { formatCountdown, HERO_ID } from "./TodaySky";

/** Плашка вместо неба (концепция, слайд 5): появляется сверху, когда небо ушло с экрана. Без анимации. */
export function CompactBar() {
  const clock = useSkyClock();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(HERO_ID);
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { rootMargin: "-160px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  if (!visible || !clock) return null;
  const { next, now } = clock;

  return (
    <div className="fixed inset-x-0 top-0 z-40 px-3 pt-[max(8px,env(safe-area-inset-top))] md:hidden">
      <div className="flex items-center gap-3 rounded-[20px] border border-[rgb(246_207_150/0.22)] bg-[rgb(10_14_34/0.92)] px-4 py-2.5 text-light backdrop-blur-[10px]">
        <span
          aria-hidden="true"
          className="size-5 shrink-0 rounded-full bg-sun shadow-[0_0_14px_4px_rgb(255_233_190/0.45)]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-light/70">
            {PRAYER_NAMES[next.key]} в {formatTime(next.at)}
          </p>
          <p className="tnum text-[15px] font-semibold">через {formatCountdown(next.at.getTime() - now.getTime())}</p>
        </div>
        <span className="text-xs font-semibold text-light/70">Пенза</span>
      </div>
    </div>
  );
}
