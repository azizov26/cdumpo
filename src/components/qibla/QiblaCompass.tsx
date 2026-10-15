"use client";

import { useEffect, useRef, useState } from "react";
import { distanceToKaaba, PENZA, qiblaBearing, sideName, turnNeeded } from "@/lib/qibla";

type Place = { lat: number; lon: number; label: string };
type Sensor = "off" | "on" | "denied" | "unsupported";
type OrientationEventPermission = { requestPermission?: () => Promise<"granted" | "denied"> };
type IosOrientation = DeviceOrientationEvent & { webkitCompassHeading?: number };

const rad = (d: number) => (d * Math.PI) / 180;
const HOME: Place = { ...PENZA, label: "Пенза" };
const ALIGNED = 4; // градусов допуска
const STARS = [
  [38, 52, 1.2],
  [92, 30, 1],
  [270, 44, 1.4],
  [300, 118, 1],
  [28, 210, 1.1],
  [296, 250, 1.3],
  [64, 292, 1],
  [250, 300, 1.2],
];

export function QiblaCompass() {
  const [place, setPlace] = useState<Place>(HOME);
  const [geo, setGeo] = useState<"idle" | "wait" | "denied" | "error">("idle");
  const [sensor, setSensor] = useState<Sensor>("off");
  const [heading, setHeading] = useState<number | null>(null);
  const last = useRef<number | null>(null);

  const bearing = qiblaBearing(place);
  const km = Math.round(distanceToKaaba(place) / 10) * 10;
  const turn = heading === null ? null : turnNeeded(heading, bearing);
  const aligned = turn !== null && Math.abs(turn) <= ALIGNED;

  const locate = () => {
    if (!navigator.geolocation) return setGeo("error");
    setGeo("wait");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPlace({ lat: p.coords.latitude, lon: p.coords.longitude, label: "Ваше место" });
        setGeo("idle");
      },
      (e) => setGeo(e.code === e.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 600_000 },
    );
  };

  const stop = useRef<(() => void) | null>(null);
  useEffect(() => () => stop.current?.(), []);

  const startCompass = async () => {
    const DOE = window.DeviceOrientationEvent as unknown as OrientationEventPermission | undefined;
    if (!DOE) return setSensor("unsupported");
    if (typeof DOE.requestPermission === "function") {
      try {
        if ((await DOE.requestPermission()) !== "granted") return setSensor("denied");
      } catch {
        return setSensor("denied");
      }
    }
    const onOrient = (e: Event) => {
      const o = e as IosOrientation;
      let h: number | null = null;
      if (typeof o.webkitCompassHeading === "number") h = o.webkitCompassHeading;
      else if (o.absolute && typeof o.alpha === "number") h = (360 - o.alpha) % 360;
      if (h === null || Number.isNaN(h)) return;
      if (last.current !== null && Math.abs(turnNeeded(last.current, h)) < 1) return; // без дрожания
      last.current = h;
      setHeading(h);
    };
    window.addEventListener("deviceorientationabsolute", onOrient);
    window.addEventListener("deviceorientation", onOrient);
    stop.current = () => {
      window.removeEventListener("deviceorientationabsolute", onOrient);
      window.removeEventListener("deviceorientation", onOrient);
    };
    setSensor("on");
  };

  const rot = heading === null ? 0 : -heading;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:items-center">
      <div className="mx-auto w-full max-w-[420px] rounded-[32px] bg-night p-4 text-light">
        <svg
          viewBox="0 0 340 340"
          role="img"
          aria-label={`Компас: кибла — ${Math.round(bearing)}° (${sideName(bearing)})`}
          className="block w-full"
        >
          <defs>
            <radialGradient id="qb-sky" cx="50%" cy="40%" r="70%">
              <stop offset="0" stopColor="#1b2860" />
              <stop offset="1" stopColor="#0b1636" />
            </radialGradient>
          </defs>
          <circle cx="170" cy="170" r="164" fill="url(#qb-sky)" />
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#f6f2ea" opacity=".6" />
          ))}
          <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: "170px 170px" }}>
            <circle cx="170" cy="170" r="132" fill="none" stroke="#f6f2ea" strokeOpacity=".28" />
            {Array.from({ length: 36 }, (_, i) => (
              <line
                key={i}
                x1="170"
                y1={i % 9 === 0 ? 36 : 40}
                x2="170"
                y2={i % 9 === 0 ? 50 : 46}
                stroke="#f6f2ea"
                strokeOpacity={i % 9 === 0 ? 0.7 : 0.35}
                transform={`rotate(${i * 10} 170 170)`}
              />
            ))}
            {[
              ["С", 0],
              ["В", 90],
              ["Ю", 180],
              ["З", 270],
            ].map(([t, a]) => {
              const x = 170 + 94 * Math.sin(rad(Number(a)));
              const y = 170 - 94 * Math.cos(rad(Number(a)));
              return (
                <text
                  key={t}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="18"
                  fontWeight="700"
                  fill="#f6f2ea"
                  fillOpacity={t === "С" ? 1 : 0.7}
                  style={{ transform: `rotate(${-rot}deg)`, transformOrigin: `${x}px ${y}px` }}
                >
                  {t}
                </text>
              );
            })}
            {/* Кибла: линия от центра и знак Каабы на ободе */}
            <g transform={`rotate(${bearing} 170 170)`}>
              <line x1="170" y1="170" x2="170" y2="96" stroke="#f4b67c" strokeWidth="2" strokeLinecap="round" />
              <rect
                x="158"
                y="84"
                width="24"
                height="24"
                rx="3"
                fill={aligned ? "#f4b67c" : "#0b1636"}
                stroke="#f4b67c"
                strokeWidth="2"
              />
              <path d="M158 92h24" stroke="#f4b67c" strokeWidth="2" />
              <rect x="167" y="96" width="6" height="12" rx="1" fill="#f4b67c" opacity={aligned ? 0.0 : 0.9} />
            </g>
            <circle cx="170" cy="170" r="4" fill="#f4b67c" />
          </g>
          {/* Неподвижная метка «вперёд» */}
          <path d="M170 10 l9 16 h-18 z" fill={aligned ? "#f4b67c" : "#f6f2ea"} />
        </svg>
      </div>

      <div>
        <p className="text-[13px] font-semibold tracking-[0.08em] text-fg-3 uppercase">{place.label}</p>
        <p className="font-display mt-1 text-[56px] leading-none font-medium md:text-[72px]">
          {Math.round(bearing)}°<span className="ml-3 text-[22px] text-fg-2 md:text-[26px]">{sideName(bearing)}</span>
        </p>
        <p className="mt-3 text-[17px] text-fg-2">
          До Каабы около <b className="text-fg">{new Intl.NumberFormat("ru-RU").format(km)} км</b>.
        </p>

        <p aria-live="polite" className="mt-5 min-h-[3.2em] text-[17px] leading-[1.5]">
          {turn === null
            ? "Север сверху. Включите компас, и циферблат будет поворачиваться вместе с телефоном."
            : aligned
              ? "Вы смотрите на Каабу."
              : `Повернитесь ${turn > 0 ? "вправо" : "влево"} на ${Math.round(Math.abs(turn))}°.`}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={locate}
            disabled={geo === "wait"}
            className="inline-flex h-[50px] items-center rounded-full border border-btn-line bg-btn-line-bg px-[22px] text-[14.5px] font-bold text-fg transition-colors duration-200 hover:border-fg-3 disabled:opacity-60"
          >
            {geo === "wait" ? "Определяем…" : "Определить моё место"}
          </button>
          {sensor !== "on" && (
            <button
              type="button"
              onClick={startCompass}
              className="inline-flex h-[50px] items-center rounded-full bg-zarya px-[22px] text-[14.5px] font-bold text-on-gold transition-colors duration-200 hover:bg-[#f5c08f]"
            >
              Включить компас
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-4 space-y-1 text-[14px] text-fg-3">
          {geo === "denied" && <p>Доступ к местоположению закрыт — показано направление из Пензы.</p>}
          {geo === "error" && <p>Не удалось определить место — показано направление из Пензы.</p>}
          {sensor === "denied" && <p>Доступ к датчикам закрыт. Разрешите его в настройках браузера.</p>}
          {sensor === "unsupported" && (
            <p>На этом устройстве нет компаса — ориентируйтесь по градусам и сторонам света.</p>
          )}
          {sensor === "on" && heading === null && <p>Ждём данные датчика. Покачайте телефон «восьмёркой».</p>}
        </div>
        <p className="mt-6 max-w-[52ch] text-[14px] leading-[1.55] text-fg-3">
          Положение вычисляется в браузере и никуда не отправляется. Компас телефона может ошибаться рядом с металлом и
          магнитами — для надёжности сверьтесь с ориентиром в мечети.
        </p>
      </div>
    </div>
  );
}
