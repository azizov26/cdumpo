import data from "@/data/constellation.json";
import { r1 } from "@/lib/sky/geometry";
import { Crescent } from "./SkyGraphic";

// Созвездие Соборной мечети: 120 звёзд и 109 линий из эталона (data/constellation.json).
// Звезда горит, если order ≤ lit. Отрисовка — как drawConstellation в эталоне.

export const CONSTELLATION_TOTAL = data.stars.length;

export const litFromProgress = (collected: number, goal: number) =>
  Math.max(0, Math.min(CONSTELLATION_TOTAL, Math.round((CONSTELLATION_TOTAL * collected) / goal)));

const byId = new Map(data.stars.map((s) => [s.id, s]));

export function Constellation({ lit, newest = false, className = "" }: { lit: number; newest?: boolean; className?: string }) {
  const r = 3.4;
  const isLit = (order: number) => order <= lit;
  const latest = newest && lit > 0 ? data.stars.find((s) => s.order === lit) : undefined;
  const c = data.crescent;

  return (
    <svg
      viewBox={data.viewBox.join(" ")}
      role="img"
      aria-label={`Созвездие Соборной мечети: зажжено ${lit} из ${CONSTELLATION_TOTAL} звёзд`}
      className={className}
    >
      <g>
        {data.lines.map(([a, b]) => {
          const A = byId.get(a)!;
          const B = byId.get(b)!;
          const on = isLit(A.order) && isLit(B.order);
          return (
            <line
              key={`${a}-${b}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={on ? "#F6CF96" : "rgba(255,240,215,.5)"}
              strokeWidth={on ? 1 : 0.6}
              strokeDasharray={on ? undefined : "2 4"}
              opacity={on ? 0.55 : 0.5}
            />
          );
        })}
      </g>
      <g>
        {data.stars.map((s) => {
          const rr = r1(r * s.size);
          return isLit(s.order) ? (
            <g key={s.id}>
              <circle cx={s.x} cy={s.y} r={r1(rr * 3.2)} fill="#F6CF96" opacity=".14" />
              <circle cx={s.x} cy={s.y} r={rr} fill="#FFE7B8" />
            </g>
          ) : (
            <circle key={s.id} cx={s.x} cy={s.y} r={r1(rr * 0.7)} fill="none" stroke="rgba(255,240,215,.45)" strokeWidth=".8" />
          );
        })}
      </g>
      <Crescent
        x={c.cx}
        y={c.cy}
        r={c.r}
        fill={lit >= CONSTELLATION_TOTAL ? "#FFE7B8" : "rgba(255,240,215,.35)"}
        id="constellation-crescent"
      />
      {latest && (
        <g>
          <circle cx={latest.x} cy={latest.y} r={r1(r * 4.5)} fill="none" stroke="#F6CF96" strokeWidth="1.2" />
          <circle cx={latest.x} cy={latest.y} r={r1(r * 8)} fill="none" stroke="#F6CF96" strokeWidth=".8" opacity=".5" />
          <circle cx={latest.x} cy={latest.y} r={r1(r * 1.7)} fill="#FFF6E0" />
        </g>
      )}
    </svg>
  );
}
