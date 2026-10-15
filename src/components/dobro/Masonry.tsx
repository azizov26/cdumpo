"use client";

import { useEffect, useRef, useState } from "react";

// «Камень к камню»: Соборная мечеть складывается из камней снизу вверх. Уложенная часть — доля собранной суммы,
// выше — бледный чертёж будущей кладки. Полумесяц на куполе загорается, когда сбор закрыт.
// Движение (DESIGN.md): кладка поднимается рядами при первом появлении на экране; новый камень опускается
// на место, шов вспыхивает и гаснет. Только transform/opacity, ease-out, без пружин; уровень 0 — готовый кадр.

export type Part = "foundation" | "walls" | "drum" | "dome" | "minarets";
export const PART_NAME: Record<Part, string> = {
  foundation: "Фундамент",
  walls: "Стены молельного зала",
  drum: "Барабан купола",
  dome: "Купол",
  minarets: "Минареты",
};
const PARTS = Object.keys(PART_NAME) as Part[];

type Brick = { x: number; y: number; w: number; h: number; part: Part; tone: number; row: number };

const G = 420; // линия земли
const domeHalf = (y: number) => {
  const t = (228 - y) / 104; // 0 у основания купола, 1 у шпиля
  return t < 0 || t > 1 ? -1 : 76 * Math.sqrt(1 - t * t) * (1 - 0.32 * t);
};
const inArch = (x: number, y: number, cx: number, top: number, w: number, bottom: number) =>
  Math.abs(x - cx) <= w / 2 && y <= bottom && (y >= top + w / 2 || Math.hypot(x - cx, y - (top + w / 2)) <= w / 2);
/** Проёмы: вход и четыре окна зала. [центр, верх, ширина, низ] */
const HOLES: [number, number, number, number][] = [
  [300, 346, 36, G],
  [212, 284, 18, 326],
  [256, 284, 18, 326],
  [344, 284, 18, 326],
  [388, 284, 18, 326],
];

function partAt(x: number, y: number): Part | null {
  if (HOLES.some(([cx, top, w, b]) => inArch(x, y, cx, top, w, b))) return null;
  const base = y > G - 24;
  if ((x >= 98 && x <= 138) || (x >= 462 && x <= 502)) {
    if (y >= 150 && y <= G) return base ? "foundation" : "minarets";
    const c = x < 300 ? 118 : 482;
    if (y >= 96 && y < 150 && Math.abs(x - c) <= (22 * (y - 96)) / 54) return "minarets";
  }
  if (x >= 146 && x <= 454 && y >= 340 && y <= G) return base ? "foundation" : "walls";
  if (x >= 170 && x <= 430 && y >= 262 && y <= G) return base ? "foundation" : "walls";
  if (x >= 226 && x <= 374 && y >= 228 && y < 262) return "drum";
  const h = domeHalf(y);
  if (h >= 0 && Math.abs(x - 300) <= h) return "dome";
  return null;
}

function buildBricks(): Brick[] {
  const bw = 19.2,
    bh = 11,
    sx = 20,
    sy = 12;
  const out: Brick[] = [];
  for (let r = 0; G - (r + 1) * sy > 90; r++) {
    const y = G - (r + 1) * sy + 1;
    const off = r % 2 ? sx / 2 : 0; // перевязка швов
    for (let x = 80 + off; x < 520; x += sx) {
      const p = partAt(x + bw / 2, y + bh / 2);
      if (!p || !partAt(x + 3, y + bh - 1) || !partAt(x + bw - 3, y + bh - 1)) continue;
      // Фактура камня — целочисленный хеш: одинаково на сервере и в браузере.
      const tone = ((((x * 73856093) ^ (y * 19349663)) >>> 0) % 100) / 100;
      out.push({ x, y, w: bw, h: bh, part: p, tone, row: r });
    }
  }
  // Кладка идёт рядами снизу вверх, в ряду — от центра к краям.
  out.sort((a, b) => a.row - b.row || Math.abs(a.x + bw / 2 - 300) - Math.abs(b.x + bw / 2 - 300));
  return out;
}

const BRICKS = buildBricks();
const TOTAL = BRICKS.length;
const PART_TOTAL = Object.fromEntries(PARTS.map((p) => [p, BRICKS.filter((b) => b.part === p).length])) as Record<
  Part,
  number
>;

function partPercent(p: Part, laid: number) {
  let n = 0;
  for (let i = 0; i < laid; i++) if (BRICKS[i].part === p) n++;
  return Math.round((100 * n) / PART_TOTAL[p]);
}

export function Masonry({
  progress,
  interactive = false,
  demo = false,
  className = "",
}: {
  /** Доля собранного, 0…1. */
  progress: number;
  /** Этапы стройки под рисунком: нажатие показывает, насколько готова часть. */
  interactive?: boolean;
  /** Кнопка «как ляжет ваш камень» — только показ движения, оплаты нет. */
  demo?: boolean;
  className?: string;
}) {
  const base = Math.round(TOTAL * Math.max(0, Math.min(1, progress)));
  const [extra, setExtra] = useState(0);
  const laid = Math.min(TOTAL, base + extra);
  const [part, setPart] = useState<Part | null>(null);
  // Кладка «поднимается» один раз, когда блок впервые показался на экране.
  const ref = useRef<SVGSVGElement>(null);
  const [phase, setPhase] = useState<"wait" | "rise" | "done">("done");
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
        setPhase("rise");
        t = setTimeout(() => setPhase("done"), 2600);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    // Прячем кладку только если блок ещё ниже экрана — то, что видно сразу, не мигает.
    if (el.getBoundingClientRect().top > window.innerHeight * 0.85) {
      setPhase("wait");
      io.observe(el);
    }
    return () => {
      io.disconnect();
      if (t) clearTimeout(t);
    };
  }, []);

  const done = laid >= TOTAL;
  const wallsDone = partPercent("walls", laid) >= 95;
  const pct = Math.round((100 * laid) / TOTAL);

  return (
    <div className={className}>
      <svg
        ref={ref}
        viewBox="70 70 460 360"
        className="w-full"
        role="img"
        aria-label={`Соборная мечеть из камней: уложено около ${pct}% кладки`}
        data-phase={phase}
      >
        <line x1="70" y1={G + 0.5} x2="530" y2={G + 0.5} stroke="rgba(255,240,215,.25)" />
        {/* чертёж — места будущих камней; следующее место отмечено */}
        <g>
          {BRICKS.slice(laid).map((b, i) => (
            <rect
              key={`p${laid + i}`}
              x={b.x + 0.5}
              y={b.y + 0.5}
              width={b.w - 1}
              height={b.h - 1}
              rx="1.5"
              fill="none"
              stroke={i === 0 ? "#F6CF96" : "rgba(255,240,215,.13)"}
              strokeWidth={i === 0 ? 1 : 0.5}
            />
          ))}
        </g>
        <g>
          {BRICKS.slice(0, laid).map((b, i) => {
            const isNew = extra > 0 && i === laid - 1;
            return (
              <g
                key={isNew ? `n${extra}` : `b${i}`}
                className={isNew ? "stone-new" : "stone"}
                style={phase === "rise" ? { animationDelay: `${Math.round((G - b.y) * 4.4)}ms` } : undefined}
              >
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5" fill="#F6CF96" opacity={0.7 + b.tone * 0.25} />
                {isNew && (
                  <rect
                    x={b.x - 2}
                    y={b.y - 2}
                    width={b.w + 4}
                    height={b.h + 4}
                    rx="3"
                    fill="none"
                    stroke="#FFF6E4"
                    strokeWidth="1.2"
                    className="stone-seam"
                  />
                )}
              </g>
            );
          })}
        </g>
        {/* проёмы загораются, когда стены зала уложены */}
        {HOLES.map(([cx, top, w, b], i) => (
          <path
            key={i}
            d={`M${cx - w / 2} ${b} V${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${top + w / 2} V${b} Z`}
            fill={wallsDone ? "rgba(246,199,126,.5)" : "transparent"}
            stroke="rgba(255,240,215,.3)"
            strokeWidth="0.6"
            className="stone-light"
          />
        ))}
        {/* полумесяц — последний камень */}
        <g transform="translate(300 84)" opacity={done ? 1 : 0.3} className="stone-light">
          <line x1="0" y1="10" x2="0" y2="40" stroke={done ? "#F6CF96" : "rgba(255,240,215,.4)"} strokeWidth="1.4" />
          <path
            d="M6 -6 a10 10 0 1 0 0 14 a8 8 0 1 1 0 -14 z"
            fill={done ? "#FFF6E4" : "none"}
            stroke="#F6CF96"
            strokeWidth="0.8"
          />
        </g>
      </svg>

      {interactive && (
        <>
          <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Этапы стройки">
            {PARTS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={part === p}
                onClick={() => setPart(part === p ? null : p)}
                className={`min-h-[44px] rounded-full px-3.5 text-[13.5px] transition-colors duration-200 ${
                  part === p ? "bg-zarya text-on-gold" : "bg-white/6 text-light/85 hover:bg-white/10"
                }`}
              >
                {PART_NAME[p]}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-3 min-h-[3em] text-[14.5px] leading-[1.5] text-light/72">
            {part
              ? `${PART_NAME[part]} — уложено ${partPercent(part, laid)}%. Здесь появятся фото этого этапа и отчёт, на что пошли средства.`
              : "Выберите этап стройки — покажем, насколько он готов."}
          </p>
        </>
      )}

      {demo && (
        <button
          type="button"
          disabled={done}
          onClick={() => setExtra((n) => n + 1)}
          className="mt-2 inline-flex min-h-[44px] items-center rounded-full border border-light/25 px-4 text-[14px] font-semibold text-light/90 transition-colors duration-200 hover:border-light/50 disabled:opacity-50"
        >
          Показать, как ляжет ваш камень
        </button>
      )}
    </div>
  );
}
