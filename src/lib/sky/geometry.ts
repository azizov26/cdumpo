// Порт эталонного генератора дизайнера (docs/concept-v2-source/…/js/sky-lib.js).
// Те же формулы и seed — графика совпадает с макетами 1:1. Не «улучшать» без сверки с эталоном.

export type SkyState = "dawn" | "day" | "asr" | "evening" | "night";
export type FrameName = "phone" | "desktop";

/** Детерминированный ГСЧ (Park–Miller), как в эталоне. */
export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
export const r1 = (v: number) => Math.round(v * 10) / 10;

export const SKY: Record<
  SkyState,
  { stops: [number, string][]; stars: number; starLim: number; body: "sun" | "moon"; theme: "light" | "dark"; windows: number }
> = {
  dawn: { stops: [[0, "#1E2450"], [30, "#4E427A"], [55, "#B9819E"], [75, "#F0BE9E"], [100, "#F8E3C6"]], stars: 40, starLim: 0.5, body: "sun", theme: "dark", windows: 0.75 },
  day: { stops: [[0, "#6FA3CF"], [40, "#A9CBE3"], [75, "#E4ECEA"], [100, "#F6F2EA"]], stars: 0, starLim: 0.5, body: "sun", theme: "light", windows: 0 },
  asr: { stops: [[0, "#5F8DBC"], [35, "#B7C4C9"], [62, "#EBC98E"], [80, "#F2B57C"], [100, "#F6E3C0"]], stars: 0, starLim: 0.5, body: "sun", theme: "light", windows: 0 },
  evening: { stops: [[0, "#0B1636"], [20, "#1A2350"], [38, "#3D2D5E"], [52, "#8A4A62"], [64, "#D9805A"], [72, "#F2B57C"], [80, "#F6CF96"]], stars: 110, starLim: 0.5, body: "sun", theme: "dark", windows: 0.75 },
  night: { stops: [[0, "#03071A"], [35, "#081131"], [60, "#101B48"], [74, "#1B2658"], [82, "#0C1128"]], stars: 230, starLim: 0.75, body: "moon", theme: "dark", windows: 0.95 },
};

type Building = ["T" | "H" | "D", number, number];

export type Frame = {
  W: number;
  H: number;
  arc: { cx: number; cy: number; rx: number; ry: number };
  sunR: number;
  glowR: number;
  moon: { x: number; y: number; r: number };
  base: number;
  k: number;
  buildings: Building[];
  starsMul: number;
  arcW: number;
  dotR: number;
};

export const FRAME: Record<FrameName, Frame> = {
  phone: {
    W: 390, H: 844, arc: { cx: 195, cy: 640, rx: 184, ry: 452 }, sunR: 15, glowR: 90, moon: { x: 330, y: 190, r: 16 }, base: 612, k: 1,
    buildings: [["T", 0.16, 1], ["H", 0.38, 1], ["D", 0.69, 1], ["H", 0.93, 1], ["H", 0.04, 0.8]], starsMul: 1, arcW: 1.1, dotR: 3.5,
  },
  desktop: {
    W: 1440, H: 900, arc: { cx: 720, cy: 770, rx: 640, ry: 600 }, sunR: 24, glowR: 150, moon: { x: 1180, y: 170, r: 26 }, base: 760, k: 1.6,
    buildings: [["T", 0.13, 1.1], ["H", 0.3, 1], ["T", 0.4, 0.9], ["D", 0.7, 1.05], ["H", 0.83, 1], ["T", 0.95, 1]], starsMul: 1.7, arcW: 1.6, dotR: 5,
  },
};

/** Точки на дуге (градусы): 180 — восход, 90 — зухр, 42 — аср, 0 — магриб. */
export const ARC_DOTS = [180, 90, 42, 0];

export function arcPoint(f: Frame, angleDeg: number) {
  const { cx, cy, rx, ry } = f.arc;
  const a = (angleDeg * Math.PI) / 180;
  return { x: r1(cx + rx * Math.cos(a)), y: r1(cy - ry * Math.sin(a)) };
}

/** Восьмиконечная звезда (два квадрата) как polygon points. */
export function starPts(R: number, cx = 0, cy = 0, rot = 0) {
  const r = (R * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  const p: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = rot + (i * Math.PI) / 8 - Math.PI / 2;
    const rr = i % 2 ? r : R;
    p.push(`${r1(cx + rr * Math.cos(a))},${r1(cy + rr * Math.sin(a))}`);
  }
  return p.join(" ");
}

export function skyStars(state: SkyState, f: Pick<Frame, "W" | "H" | "starsMul">, seed = 101) {
  const s = SKY[state];
  const R = rng(seed);
  const n = Math.round(s.stars * f.starsMul);
  const out: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = R() * f.W;
    const y = R() * R() * f.H * s.starLim;
    const o = Math.max(0, 1 - y / (f.H * s.starLim)) * (0.35 + R() * 0.65);
    out.push({ x: r1(x), y: r1(y), r: R() < 0.08 ? 1.4 : 0.8, o: +o.toFixed(2) });
  }
  return out;
}

export type Shape =
  | { t: "path"; d: string }
  | { t: "rect"; x: number; y: number; w: number; h: number }
  | { t: "circle"; cx: number; cy: number; r: number };

export type BuildingShape = { transform: string; shapes: Shape[]; windows: Shape[] };

/** Силуэт города: земля, деревья и здания (T — мечеть с минаретом, D — купол с двумя минаретами, H — дом). */
export function skyline(f: Pick<Frame, "W" | "H" | "base" | "k" | "buildings">, seed: number) {
  const { W, H, base, k } = f;
  const R = rng(seed);
  const ground: Shape[] = [
    {
      t: "path",
      d: `M0,${base} C${r1(W * 0.2)},${base - 8} ${r1(W * 0.4)},${base - 2} ${r1(W * 0.6)},${base - 8} C${r1(W * 0.8)},${base - 12} ${r1(W * 0.9)},${base - 4} ${W},${base - 8} L${W},${H} L0,${H}Z`,
    },
  ];
  for (let i = 0; i < W / 15; i++) {
    const x = R() * W;
    const rr = (6 + R() * 14) * k;
    ground.push({ t: "circle", cx: r1(x), cy: r1(base - rr * 0.3 + R() * 6), r: r1(rr) });
  }
  const buildings: BuildingShape[] = f.buildings.map(([type, xf, sc]) => {
    const x = W * xf;
    const kk = k * sc;
    const transform = `translate(${r1(x)} ${r1(base + 10 * kk)}) scale(${Math.round(kk * 100) / 100})`;
    const s: Shape[] = [];
    if (type === "T") {
      s.push({ t: "rect", x: -36, y: -36, w: 72, h: 36 }, { t: "path", d: "M-40,-36 L0,-56 L40,-36Z" });
      let y = -50;
      for (const [tw, th] of [[11, 24], [9, 20], [7, 14]]) {
        s.push({ t: "rect", x: -tw / 2, y: y - th, w: tw, h: th }, { t: "rect", x: -tw / 2 - 2, y: y - th - 2, w: tw + 4, h: 2 });
        y -= th + 2;
      }
      s.push({ t: "path", d: `M-4.5,${y} L0,${y - 20} L4.5,${y}Z` });
      y -= 20;
      s.push({ t: "rect", x: -0.6, y: y - 7, w: 1.2, h: 7 });
    } else if (type === "D") {
      s.push({ t: "rect", x: -48, y: -42, w: 96, h: 42 }, { t: "path", d: "M-27,-42 C-27,-92 27,-92 27,-42Z" }, { t: "rect", x: -0.8, y: -99, w: 1.6, h: 10 });
      for (const mx of [-57, 57]) {
        s.push(
          { t: "rect", x: mx - 4.5, y: -104, w: 9, h: 104 },
          { t: "rect", x: mx - 7, y: -80, w: 14, h: 3 },
          { t: "path", d: `M${mx - 5},-104 L${mx},-130 L${mx + 5},-104Z` },
        );
      }
    } else {
      s.push({ t: "rect", x: -17, y: -18, w: 34, h: 18 }, { t: "path", d: "M-20,-18 L0,-32 L20,-18Z" });
    }
    return {
      transform,
      shapes: s,
      windows: [
        { t: "rect", x: -14, y: -24, w: 4, h: 6 },
        { t: "rect", x: 6, y: -24, w: 4, h: 6 },
      ],
    };
  });
  return { ground, buildings };
}

/** Угол солнца на дуге по времени: 180 — восход, 0 — магриб; вне дня — null. */
export function sunAngle(now: Date, sunrise: Date, maghrib: Date): number | null {
  const f = (now.getTime() - sunrise.getTime()) / (maghrib.getTime() - sunrise.getTime());
  if (f < 0 || f > 1) return null;
  return 180 * (1 - f);
}
