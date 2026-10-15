"use client";

import { useEffect, type RefObject } from "react";

/**
 * Уровень 2: небо смещается вслед за курсором или наклоном телефона на 6–10 px.
 * Пишет --px и --py (−1…1) в стиль блока, сглаживание — в requestAnimationFrame.
 * Работает только при html[data-motion="2"] и пока блок на экране.
 */
export function useSkyParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || document.documentElement.dataset.motion !== "2") return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let visible = true;

    const frame = () => {
      raf = 0;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
      if (visible && (Math.abs(tx - x) > 0.002 || Math.abs(ty - y) > 0.002)) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    };
    // Наклон: на Android событие приходит сразу; iOS требует разрешения — там движение просто не включается.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
      kick();
    };

    el.addEventListener("pointermove", onPointer);
    window.addEventListener("deviceorientation", onTilt);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(el);

    return () => {
      el.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
