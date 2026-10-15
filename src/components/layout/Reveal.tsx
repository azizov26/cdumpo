"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Появление блока при прокрутке: opacity 0 → 1, сдвиг 16 → 0, 600 мс (DESIGN.md → «Каталог»).
 * Без JavaScript и на уровне 0 («тихий») блок виден сразу. Скрывается только то, что ещё ниже экрана.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.dataset.motion === "0") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // уже на экране

    el.dataset.reveal = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Кадр на то, чтобы скрытое состояние отрисовалось: иначе переход не запустится.
        requestAnimationFrame(() => (el.dataset.reveal = "shown"));
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="reveal-block">
      {children}
    </div>
  );
}
