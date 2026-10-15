import { Button } from "@/components/ui/Button";
import { Soon } from "@/components/ui/Tag";
import { Icon } from "@/components/ui/Icon";
import { r1, rng, starPts } from "@/lib/sky/geometry";
import { SectionHeading } from "./SectionHeading";

// Схема карты — порт эталона (#belowMap, seed 5). Огни условные, не реальные координаты мечетей.
const R = rng(5);
const LIGHTS = Array.from({ length: 34 }, () => ({ x: r1(R() * 748), y: r1(R() * 460) }));
const PINS: [number, number, boolean][] = [
  [300, 240, true],
  [470, 180, false],
  [200, 320, false],
  [600, 300, false],
];
const ROADS: [string, number][] = [
  ["M0,90 L748,150", 10],
  ["M120,0 L230,460", 9],
  ["M520,0 C480,160 600,300 540,460", 9],
  ["M0,300 L748,260", 8],
  ["M0,400 C250,360 500,430 748,380", 6],
];

function MosquesMap() {
  return (
    <svg viewBox="0 0 748 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="size-full">
      <defs>
        <radialGradient id="map-glow">
          <stop offset="0%" stopColor="#FFD58E" stopOpacity=".9" />
          <stop offset="35%" stopColor="#F2A65A" stopOpacity=".35" />
          <stop offset="100%" stopColor="#F2A65A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="748" height="460" fill="#0A1230" />
      <path
        d="M-20,170 C150,150 230,250 380,220 C540,190 600,120 770,150"
        fill="none"
        stroke="#16295A"
        strokeWidth="26"
      />
      {ROADS.map(([d, w]) => (
        <path key={d} d={d} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={w} />
      ))}
      {LIGHTS.map((l, i) => (
        <g key={i}>
          <circle cx={l.x} cy={l.y} r="16" fill="url(#map-glow)" />
          <circle cx={l.x} cy={l.y} r="2.6" fill="#FFE7B8" />
        </g>
      ))}
      {PINS.map(([x, y, on]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="38" fill="url(#map-glow)" />
          <circle cx={x} cy={y} r="15" fill={on ? "#F2B57C" : "#16214A"} stroke="#F2B57C" strokeWidth="1.5" />
          <polygon points={starPts(7.5, x, y)} fill={on ? "#1C1020" : "#F6CF96"} />
        </g>
      ))}
    </svg>
  );
}

export function MosquesSection() {
  return (
    <section aria-labelledby="mosques-title" className="container-site pt-14 pb-16 md:pt-24 md:pb-24">
      <div className="grid items-stretch gap-6 lg:grid-cols-[420px_1fr] lg:gap-8">
        <div>
          <SectionHeading
            id="mosques-title"
            label="Мечети и общины"
            title={"Мечеть рядом\u00a0—"}
            accent="в два касания"
          />
          <p className="-mt-2 text-[15px] leading-[1.55] text-fg-2 lg:text-[17px]">
            Карта всех мечетей области: адрес, джума, имам, удобства и маршрут.
          </p>
          <p className="mt-5 text-[14.5px]">
            <Soon>Список мечетей области готовится</Soon>
          </p>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-7">
            <Button href="/mosques" variant="night">
              <Icon name="mosques" />
              Открыть карту
            </Button>
          </div>
        </div>
        {/* Иллюстрация, а не карта: огни условные, пока муфтият не передал адреса мечетей. */}
        <div className="relative h-[240px] overflow-hidden rounded-xl md:h-[460px]">
          <MosquesMap />
          <span className="absolute bottom-4 left-4 rounded-full bg-night/80 px-3 py-1.5 text-[12.5px] text-light/85">
            Иллюстрация · карта готовится
          </span>
        </div>
      </div>
    </section>
  );
}
