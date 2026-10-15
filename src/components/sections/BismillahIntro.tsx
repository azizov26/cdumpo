"use client";

import { useEffect } from "react";

// Заставка «Бисмиллях» при открытии сайта: ~2.5 с, один раз за сессию (см. styles/motion.css).
// Показ/пропуск решает ранний скрипт в layout.tsx (data-intro на <html>), здесь — только завершение.

const INTRO_MS = 3100; // 2.5 с показа + 0.6 с ухода
const REVEAL_MS = 6000; // заставка + открытие неба

export function BismillahIntro() {
  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      if (html.dataset.intro === "play") html.dataset.intro = "done";
    };
    const skip = () => finish();
    const t1 = setTimeout(finish, INTRO_MS);
    const t2 = setTimeout(() => (html.dataset.revealed = "1"), REVEAL_MS);
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  return (
    <div
      className="intro cursor-pointer"
      aria-hidden="true"
      onClick={() => {
        const html = document.documentElement;
        if (html.dataset.intro === "play") html.dataset.intro = "done";
      }}
    >
      <div className="text-center">
        <p
          lang="ar"
          dir="rtl"
          className="intro-ar font-ar text-[clamp(40px,9vw,96px)] leading-[1.6] text-gold-soft [text-shadow:0_0_40px_rgb(246_207_150/0.25)]"
        >
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="intro-ru mt-2 font-display text-[clamp(18px,2.2vw,26px)] text-light/80 italic">
          Во имя Аллаха, Милостивого, Милосердного
        </p>
      </div>
    </div>
  );
}
