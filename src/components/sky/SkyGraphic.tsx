import { useId, type CSSProperties } from "react";
import {
  ARC_DOTS,
  arcPoint,
  FRAME,
  r1,
  SKY,
  skyline,
  skyStars,
  type Frame,
  type Shape,
  type SkyState,
} from "@/lib/sky/geometry";

function ShapeEl({ s }: { s: Shape }) {
  if (s.t === "path") return <path d={s.d} />;
  if (s.t === "rect") return <rect x={s.x} y={s.y} width={s.w} height={s.h} />;
  return <circle cx={s.cx} cy={s.cy} r={s.r} />;
}

/** Полумесяц: круг с вырезом (r .85R, смещён на +.45R, −.35R), как в эталоне. */
export function Crescent({ x, y, r, fill, id }: { x: number; y: number; r: number; fill: string; id: string }) {
  return (
    <>
      <mask id={id}>
        <rect x={r1(x - r - 2)} y={r1(y - r - 2)} width={r1(2 * r + 4)} height={r1(2 * r + 4)} fill="#fff" />
        <circle cx={r1(x + r * 0.45)} cy={r1(y - r * 0.35)} r={r1(r * 0.85)} fill="#000" />
      </mask>
      <circle cx={r1(x)} cy={r1(y)} r={r1(r)} fill={fill} mask={`url(#${id})`} />
    </>
  );
}

/**
 * Графика неба (эталон drawSky): градиент, звёзды, дуга, солнце или луна, силуэт.
 * sunAngle — угол на дуге (180 восход … 0 магриб) или null, если солнце за горизонтом.
 */
export function SkyGraphic({
  state,
  frame,
  sunAngle,
  arc = true,
  seed,
  className = "",
  preserve = "xMidYMax slice",
  animated = false,
}: {
  state: SkyState;
  frame: Frame | "phone" | "desktop";
  sunAngle?: number | null;
  arc?: boolean;
  seed?: number;
  className?: string;
  preserve?: string;
  /** Классы открытия первого экрана (styles/motion.css). */
  animated?: boolean;
}) {
  const a = (cls: string) => (animated ? cls : undefined);
  const uid = useId().replace(/:/g, "");
  const f = typeof frame === "string" ? FRAME[frame] : frame;
  const s = SKY[state];
  const lite = s.theme === "light";
  const stars = s.stars ? skyStars(state, f) : [];
  const city = skyline(f, seed ?? (frame === "desktop" ? 301 : 201));
  const { cx, cy, rx, ry } = f.arc;
  const sun = s.body === "sun" && sunAngle != null ? arcPoint(f, sunAngle) : null;

  return (
    <svg viewBox={`0 0 ${f.W} ${f.H}`} preserveAspectRatio={preserve} aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
          {s.stops.map(([p, c]) => (
            <stop key={p} offset={`${p}%`} stopColor={c} />
          ))}
        </linearGradient>
        <radialGradient id={`sun${uid}`}>
          <stop offset="0%" stopColor="#FFE9BE" stopOpacity=".95" />
          <stop offset="30%" stopColor="#F6B87A" stopOpacity=".45" />
          <stop offset="100%" stopColor="#F2A06A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`moon${uid}`}>
          <stop offset="0%" stopColor="#DCE4FF" stopOpacity=".3" />
          <stop offset="100%" stopColor="#DCE4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={f.W} height={f.H} fill={`url(#g${uid})`} className={a("sky-fade")} />

      {stars.length > 0 && (
        <g className={a("sky-fade")}>
          {stars.map((st, i) => (
            <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#FFF6E4" opacity={st.o} />
          ))}
        </g>
      )}

      {arc && (
        <g className={a("sky-arc")}>
          <path
            d={`M${cx - rx},${cy} A${rx},${ry} 0 0,1 ${cx + rx},${cy}`}
            fill="none"
            stroke={lite ? "rgba(22,26,46,.3)" : state === "night" ? "rgba(220,228,255,.22)" : "rgba(255,240,215,.38)"}
            strokeWidth={f.arcW}
            strokeDasharray="2 6"
          />
          {ARC_DOTS.map((d, i) => {
            const p = arcPoint(f, d);
            return (
              <circle
                key={d}
                className={a("sky-dot")}
                style={animated ? ({ "--d": `${800 + i * 150}ms` } as CSSProperties) : undefined}
                cx={p.x}
                cy={p.y}
                r={f.dotR}
                fill={lite ? "#161A2E" : "#F7F1E6"}
                opacity={state === "night" ? 0.4 : 0.7}
              />
            );
          })}
          {sun && (
            <path
              d={`M${cx - rx},${cy} A${rx},${ry} 0 0,1 ${sun.x},${sun.y}`}
              className={a("sky-progress")}
              pathLength={animated ? 1 : undefined}
              fill="none"
              stroke={lite ? "rgba(138,90,30,.6)" : "rgba(255,224,180,.6)"}
              strokeWidth={f.arcW * 1.3}
            />
          )}
        </g>
      )}

      {sun && (
        <g className={a("sky-sun")}>
          <circle cx={sun.x} cy={sun.y} r={f.glowR} fill={`url(#sun${uid})`} />
          <circle cx={sun.x} cy={sun.y} r={f.sunR} fill="#FFF3D6" />
        </g>
      )}
      {s.body === "moon" && (
        <g className={a("sky-sun")}>
          <circle cx={f.moon.x} cy={f.moon.y} r={f.moon.r * 4} fill={`url(#moon${uid})`} />
          <Crescent x={f.moon.x} y={f.moon.y} r={f.moon.r} fill="#F4EEDC" id={`cm${uid}`} />
        </g>
      )}

      <g className={a("sky-city")}>
        <g style={{ fill: "var(--sky-silhouette)" }}>
          {city.ground.map((sh, i) => (
            <ShapeEl key={i} s={sh} />
          ))}
          {city.buildings.map((b, i) => (
            <g key={i} transform={b.transform}>
              {b.shapes.map((sh, j) => (
                <ShapeEl key={j} s={sh} />
              ))}
            </g>
          ))}
        </g>
        <g fill="#F6C77E" opacity={s.windows}>
          {city.buildings.map((b, i) => (
            <g key={i} transform={b.transform}>
              {b.windows.map((sh, j) => (
                <ShapeEl key={j} s={sh} />
              ))}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

/** Обложка-заглушка вместо фото (эталон: drawSky без дуги, кадр под размер карточки). */
export function SkyPicture({
  sky,
  width = 640,
  height = 320,
  caption,
  className = "",
}: {
  sky: SkyState;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
}) {
  const frame: Frame = {
    ...FRAME.phone,
    W: width,
    H: height,
    base: Math.round(height * 0.9),
    k: (width / 640) * 1.2,
    starsMul: 0.4,
    buildings: [
      ["T", 0.18, 1],
      ["D", 0.62, 1.1],
      ["H", 0.88, 1],
    ],
  };
  return (
    <div
      data-sky={sky}
      role="img"
      aria-label={caption ?? "Фото появится позже"}
      className={`relative overflow-hidden ${className}`}
    >
      <SkyGraphic
        state={sky}
        frame={frame}
        arc={false}
        seed={201}
        preserve="xMidYMid slice"
        className="absolute inset-0 size-full"
      />
    </div>
  );
}
