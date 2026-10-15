import type { CSSProperties } from "react";

// Фонарь-кандиль: свет внутри разгорается вместе с вопросом (glow 0…1). Анимируется только opacity —
// плавный переход 600 мс; при reduce-motion — мгновенно (motion.css → .lantern-light).

export function Lantern({ glow, className = "" }: { glow: number; className?: string }) {
  const g = Math.max(0, Math.min(1, glow));
  const light = { "--glow": (0.12 + g * 0.88).toFixed(3) } as CSSProperties;
  return (
    <svg viewBox="0 0 200 300" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="lantern-halo">
          <stop offset="0" stopColor="#FFD58E" stopOpacity=".75" />
          <stop offset=".45" stopColor="#F2A65A" stopOpacity=".22" />
          <stop offset="1" stopColor="#F2A65A" stopOpacity="0" />
        </radialGradient>
        <clipPath id="lantern-glass">
          <path d="M62 120 L138 120 L132 222 L68 222 Z" />
        </clipPath>
      </defs>
      {/* ореол */}
      <circle cx="100" cy="172" r="96" fill="url(#lantern-halo)" className="lantern-light" style={light} />
      {/* подвес и крышка */}
      <path d="M100 8 V40" stroke="#F6CF96" strokeWidth="1.4" />
      <circle cx="100" cy="46" r="6" fill="none" stroke="#F6CF96" strokeWidth="1.4" />
      <path d="M70 104 C70 78 88 62 100 52 C112 62 130 78 130 104 Z" fill="#F2B57C" opacity=".9" />
      <path d="M56 104 H144 L138 120 H62 Z" fill="#D9A06A" />
      {/* стекло: свет внутри */}
      <g clipPath="url(#lantern-glass)">
        <rect x="56" y="118" width="88" height="106" fill="#1B2350" />
        <rect x="56" y="118" width="88" height="106" fill="#F6C77E" className="lantern-light" style={light} />
        <path
          d="M100 150 C110 166 112 178 100 190 C88 178 90 166 100 150 Z"
          fill="#FFF6E4"
          className="lantern-light"
          style={light}
        />
      </g>
      {/* переплёт: арки, как окна мечети */}
      <g fill="none" stroke="#F6CF96" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M62 120 L138 120 L132 222 L68 222 Z" />
        <path d="M100 120 V222" />
        <path d="M74 214 V146 A12 12 0 0 1 98 146 V214" opacity=".7" />
        <path d="M102 214 V146 A12 12 0 0 1 126 146 V214" opacity=".7" />
      </g>
      <path d="M62 222 H138 L130 236 H70 Z" fill="#D9A06A" />
      <path d="M84 236 H116 L108 252 H92 Z" fill="#F2B57C" opacity=".9" />
    </svg>
  );
}
