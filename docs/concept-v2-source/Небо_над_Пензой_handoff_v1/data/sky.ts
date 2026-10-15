// Небо над Пензой — данные и генераторы для React/Next.js.
// Точная копия логики js/sky-lib.js (эталон, по которому сняты все скриншоты).

export type SkyState = 'dawn' | 'day' | 'asr' | 'evening' | 'night';
export type FrameName = 'phone' | 'desktop';

/** Детерминированный ГСЧ (Park–Miller). Те же seed → те же звёзды и деревья, что на макетах. */
export function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export const SKY: Record<SkyState, {
  stops: [number, string][]; stars: number; starZone: number;
  body: 'sun' | 'moon'; sunAngle: number | null; theme: 'light' | 'dark';
  silhouette: string; windowsOpacity: number;
}> = {
  dawn:    { stops: [[0,'#1E2450'],[30,'#4E427A'],[55,'#B9819E'],[75,'#F0BE9E'],[100,'#F8E3C6']], stars: 40,  starZone: .5,  body: 'sun',  sunAngle: 172, theme: 'dark',  silhouette: '#0C1128', windowsOpacity: .75 },
  day:     { stops: [[0,'#6FA3CF'],[40,'#A9CBE3'],[75,'#E4ECEA'],[100,'#F6F2EA']],               stars: 0,   starZone: .5,  body: 'sun',  sunAngle: 80,  theme: 'light', silhouette: '#26304F', windowsOpacity: 0 },
  asr:     { stops: [[0,'#5F8DBC'],[35,'#B7C4C9'],[62,'#EBC98E'],[80,'#F2B57C'],[100,'#F6E3C0']], stars: 0,   starZone: .5,  body: 'sun',  sunAngle: 40,  theme: 'light', silhouette: '#26304F', windowsOpacity: 0 },
  evening: { stops: [[0,'#0B1636'],[20,'#1A2350'],[38,'#3D2D5E'],[52,'#8A4A62'],[64,'#D9805A'],[72,'#F2B57C'],[80,'#F6CF96']], stars: 110, starZone: .5, body: 'sun', sunAngle: 20, theme: 'dark', silhouette: '#0C1128', windowsOpacity: .75 },
  night:   { stops: [[0,'#03071A'],[35,'#081131'],[60,'#101B48'],[74,'#1B2658'],[82,'#0C1128']], stars: 230, starZone: .75, body: 'moon', sunAngle: null, theme: 'dark', silhouette: '#0C1128', windowsOpacity: .95 },
};

/** Геометрия первого экрана в px исходного кадра. */
export const FRAME = {
  phone:   { W: 390,  H: 844, arc: { cx: 195, cy: 640, rx: 184, ry: 452 }, sunR: 15, glowR: 90,  moon: { x: 330,  y: 190, r: 16 }, base: 612, k: 1,   starsMul: 1,   arcStroke: 1.1, dotR: 3.5 },
  desktop: { W: 1440, H: 900, arc: { cx: 720, cy: 770, rx: 640, ry: 600 }, sunR: 24, glowR: 150, moon: { x: 1180, y: 170, r: 26 }, base: 760, k: 1.6, starsMul: 1.7, arcStroke: 1.6, dotR: 5 },
} as const;

/** Точки на дуге (градусы): 180 — восход, 90 — зухр, 42 — аср, 0 — магриб. */
export const ARC_DOTS = [180, 90, 42, 0];

/** Положение солнца на дуге. В проде угол считать от реального времени:
 *  angle = 180 · (1 − (now − sunrise) / (maghrib − sunrise)), ограничить [0, 180]; до восхода и после магриба солнце скрыто. */
export function sunPoint(frame: FrameName, angleDeg: number) {
  const { cx, cy, rx, ry } = FRAME[frame].arc; const a = angleDeg * Math.PI / 180;
  return { x: cx + rx * Math.cos(a), y: cy - ry * Math.sin(a) };
}

/** Звёзды неба: seed 101 — как на макетах. */
export function skyStars(state: SkyState, frame: FrameName, seed = 101) {
  const { W, H, starsMul } = FRAME[frame]; const s = SKY[state]; const R = rng(seed);
  const n = Math.round(s.stars * starsMul); const out: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = R() * W, y = R() * R() * H * s.starZone;
    const o = Math.max(0, 1 - y / (H * s.starZone)) * (.35 + R() * .65);
    out.push({ x: +x.toFixed(1), y: +y.toFixed(1), r: R() < .08 ? 1.4 : .8, o: +o.toFixed(2) });
  }
  return out; // цвет #FFF6E4; мерцают первые 12 (уровень анимации ≥1)
}

/** Положение звезды созвездия «зажжена»: order ≤ lit. lit = round(120 · собрано/цель). */
export const CONSTELLATION_STARS = 120;
export const litFromProgress = (collected: number, goal: number) =>
  Math.max(0, Math.min(CONSTELLATION_STARS, Math.round(CONSTELLATION_STARS * collected / goal)));
