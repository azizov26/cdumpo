"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// Иллюстрации двух мечетей Пензы (не фото — фото будут от муфтията). Силуэты — по описаниям из источников:
// историческая — бирюзовый особняк с эркером под круглым куполом и минаретом с коническим верхом;
// Соборная — белое здание, купола друг над другом, стройные минареты. Пропорции условные.
// Движение: при первом показе контур прорисовывается линией, затем проступает заливка и загораются окна.
// Только opacity и stroke-dashoffset; уровень 0 и reduce-motion — сразу готовый кадр.

type Phase = "idle" | "draw" | "done";

function useDrawOnView<T extends Element>() {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<Phase>("done");
  useEffect(() => {
    const el = ref.current;
    const quiet =
      document.documentElement.dataset.motion === "0" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || quiet) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        requestAnimationFrame(() => setPhase("draw"));
        t = setTimeout(() => setPhase("done"), 3600);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    setPhase("idle");
    io.observe(el);
    return () => {
      io.disconnect();
      if (t) clearTimeout(t);
    };
  }, []);
  return { ref, phase };
}

const LINE = "rgba(255,244,226,.85)";
const WIN = "#F6C77E";
const GOLD = "#F2B57C";

/** Подковообразная арка окна: x — левый край, y — верх, w×h. */
const arch = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`;
const crescent = (x: number, y: number) => `M${x + 3} ${y - 5} a6.5 6.5 0 1 0 0 10 a5.2 5.2 0 1 1 0 -10z`;

function L({ d, w = 1.1, delay = 0 }: { d: string; w?: number; delay?: number }) {
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={LINE}
      strokeWidth={w}
      strokeLinejoin="round"
      className="ma-line"
      style={{ "--d": `${delay}ms` } as CSSProperties}
    />
  );
}

function Frame({
  label,
  children,
  className,
}: {
  label: string;
  children: (phase: Phase) => ReactNode;
  className?: string;
}) {
  const { ref, phase } = useDrawOnView<SVGSVGElement>();
  return (
    <svg ref={ref} viewBox="0 0 400 300" role="img" aria-label={label} data-phase={phase} className={className}>
      <line x1="0" y1="272.5" x2="400" y2="272.5" stroke="rgba(255,240,215,.22)" />
      {children(phase)}
    </svg>
  );
}

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;

export function HistoricMosqueArt({ className = "" }: { className?: string }) {
  const upper = [135, 167.5, 200, 232.5, 265];
  const lower = [135, 167.5, 232.5, 265];
  return (
    <Frame label="Историческая мечеть на ул. Бакунина — иллюстрация" className={className}>
      {() => (
        <>
          {/* заливка: бирюзовый фасад, белый декор */}
          <g className="ma-fill">
            <path d={rect(110, 150, 180, 122)} fill="#3F8F8C" opacity=".5" />
            <path d={rect(92, 120, 34, 130)} fill="#3F8F8C" opacity=".62" />
            <path d={rect(300, 70, 20, 202)} fill="#3F8F8C" opacity=".62" />
            <path d="M98 98 A11 11 0 0 1 120 98 Z" fill={GOLD} opacity=".85" />
            <path d="M298 70 L310 30 L322 70 Z" fill="#3F8F8C" opacity=".8" />
          </g>
          {/* контур */}
          <L d={rect(110, 150, 180, 122)} delay={0} />
          <L d={rect(104, 142, 192, 8)} w={0.9} delay={250} />
          <L d="M110 210 H290" w={0.7} delay={400} />
          <L d={rect(92, 120, 34, 130)} delay={150} />
          <L d={rect(98, 98, 22, 22)} delay={500} />
          <L d="M98 98 A11 11 0 0 1 120 98" delay={700} />
          <L d="M109 87 V76" w={0.9} delay={900} />
          <L d={rect(300, 70, 20, 202)} delay={200} />
          <L d={rect(294, 112, 32, 6)} w={0.9} delay={600} />
          <L d="M298 70 L310 30 L322 70" delay={800} />
          <L d="M310 30 V22" w={0.9} delay={1000} />
          <L d={arch(186, 222, 28, 50)} delay={650} />
          {upper.map((cx, i) => (
            <L key={`u${cx}`} d={arch(cx - 7, 166, 14, 30)} w={0.8} delay={700 + i * 60} />
          ))}
          {lower.map((cx, i) => (
            <L key={`l${cx}`} d={arch(cx - 7, 224, 14, 32)} w={0.8} delay={900 + i * 60} />
          ))}
          {/* свет в окнах */}
          <g>
            {[
              ...upper.map((cx) => arch(cx - 7, 166, 14, 30)),
              ...lower.map((cx) => arch(cx - 7, 224, 14, 32)),
              arch(103, 135, 12, 26),
              arch(103, 185, 12, 26),
              arch(306, 140, 8, 18),
              arch(306, 190, 8, 18),
            ].map((d, i) => (
              <path
                key={d}
                d={d}
                fill={WIN}
                className="ma-win"
                style={{ "--d": `${1700 + i * 70}ms` } as CSSProperties}
              />
            ))}
          </g>
          <path d={crescent(109, 69)} fill="#FFF6E4" className="ma-win" style={{ "--d": "2600ms" } as CSSProperties} />
          <path d={crescent(310, 15)} fill="#FFF6E4" className="ma-win" style={{ "--d": "2700ms" } as CSSProperties} />
        </>
      )}
    </Frame>
  );
}

export function CathedralMosqueArt({ className = "" }: { className?: string }) {
  const bigDome = "M166 128 C166 96 190 84 200 70 C210 84 234 96 234 128";
  const smallDome = "M191 58 C191 48 200 44 200 38 C200 44 209 48 209 58";
  const corner = (cx: number) =>
    `M${cx - 10} 150 C${cx - 10} 136 ${cx} 132 ${cx} 126 C${cx} 132 ${cx + 10} 136 ${cx + 10} 150`;
  const minaret = (x: number) => ({
    shaft: rect(x, 64, 14, 208),
    b1: rect(x - 4, 108, 22, 5),
    b2: rect(x - 4, 168, 22, 5),
    cone: `M${x - 2} 64 L${x + 7} 24 L${x + 16} 64`,
  });
  const ms = [minaret(78), minaret(308)];
  const winMain = [132, 158, 242, 268];
  return (
    <Frame label="Соборная мечеть на проспекте Победы — иллюстрация" className={className}>
      {() => (
        <>
          <g className="ma-fill">
            <path d={rect(112, 176, 176, 96)} fill="#F6F2EA" opacity=".2" />
            <path d={rect(140, 150, 120, 26)} fill="#F6F2EA" opacity=".24" />
            <path d={rect(168, 128, 64, 22)} fill="#F6F2EA" opacity=".28" />
            <path d={`${bigDome} Z`} fill={GOLD} opacity=".9" />
            <path d={rect(193, 58, 14, 12)} fill="#F6F2EA" opacity=".3" />
            <path d={`${smallDome} Z`} fill={GOLD} opacity=".9" />
            <path d={`${corner(150)} Z`} fill={GOLD} opacity=".85" />
            <path d={`${corner(250)} Z`} fill={GOLD} opacity=".85" />
            {ms.map((m) => (
              <g key={m.shaft}>
                <path d={m.shaft} fill="#F6F2EA" opacity=".24" />
                <path d={`${m.cone} Z`} fill={GOLD} opacity=".9" />
              </g>
            ))}
          </g>
          <L d={rect(112, 176, 176, 96)} delay={0} />
          <L d={rect(140, 150, 120, 26)} delay={250} />
          <L d={rect(168, 128, 64, 22)} delay={450} />
          <L d={bigDome} delay={650} />
          <L d={rect(193, 58, 14, 12)} w={0.9} delay={900} />
          <L d={smallDome} delay={1050} />
          <L d="M200 38 V28" w={0.9} delay={1200} />
          <L d={corner(150)} w={0.9} delay={700} />
          <L d={corner(250)} w={0.9} delay={750} />
          {ms.map((m, i) => (
            <g key={m.shaft}>
              <L d={m.shaft} delay={150 + i * 80} />
              <L d={m.b1} w={0.8} delay={600 + i * 80} />
              <L d={m.b2} w={0.8} delay={650 + i * 80} />
              <L d={m.cone} delay={900 + i * 80} />
              <L d={`M${i ? 315 : 85} 24 V16`} w={0.9} delay={1100} />
            </g>
          ))}
          <L d={arch(183, 200, 34, 72)} delay={700} />
          {winMain.map((cx, i) => (
            <L key={cx} d={arch(cx - 8, 196, 16, 44)} w={0.8} delay={800 + i * 60} />
          ))}
          <g>
            {[
              ...winMain.map((cx) => arch(cx - 8, 196, 16, 44)),
              ...[160, 180, 220, 240].map((cx) => arch(cx - 4, 156, 8, 16)),
              ...[180, 192, 208, 220].map((cx) => arch(cx - 3, 133, 6, 13)),
              ...[0, 1].flatMap((i) => [arch((i ? 308 : 78) + 4, 125, 6, 16), arch((i ? 308 : 78) + 4, 190, 6, 16)]),
            ].map((d, i) => (
              <path
                key={d}
                d={d}
                fill={WIN}
                className="ma-win"
                style={{ "--d": `${1700 + i * 60}ms` } as CSSProperties}
              />
            ))}
          </g>
          <path d={crescent(200, 21)} fill="#FFF6E4" className="ma-win" style={{ "--d": "2700ms" } as CSSProperties} />
        </>
      )}
    </Frame>
  );
}
