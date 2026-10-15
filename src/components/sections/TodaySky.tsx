"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SkyGraphic } from "@/components/sky/SkyGraphic";
import {
  formatDate,
  formatHijri,
  formatTime,
  hasTable,
  PRAYER_NAMES,
  PRAYER_NAMES_AR,
  PRAYER_ORDER,
  PRAYER_UNTIL,
  type DayTimes,
  type PrayerKey,
} from "@/lib/prayer/times";
import { useApplySky, useSkyClock, type SkyClock } from "@/lib/prayer/useSkyClock";
import { sunAngle, type SkyState } from "@/lib/sky/geometry";
import { useSkyParallax } from "@/lib/sky/useSkyParallax";
import { NAV } from "@/lib/site";

// Первый экран «Сегодня» по эталону (README пакета: телефон 390×844, компьютер 1440×900).

export const HERO_ID = "today-sky";

/** Задержка появления элемента после заставки (styles/motion.css → .reveal). */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const pad = (n: number) => String(n).padStart(2, "0");
export function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

function Brand({ size }: { size: "phone" | "desktop" }) {
  const d = size === "desktop";
  return (
    <Link
      href="/"
      aria-label="ЦДУМ ПО — на главную"
      className="flex min-h-11 items-center gap-2.5 text-[color:var(--sky-text)]"
    >
      {/* Настоящий знак ЦДУМ ПО (растр с текущего сайта) — знак-звезда эталона условный. */}
      <span className={`grid shrink-0 place-items-center rounded-full bg-white ${d ? "size-11" : "size-9"}`}>
        <Image
          src="/brand/logo.png"
          alt=""
          width={747}
          height={709}
          sizes="40px"
          className={d ? "w-[38px]" : "w-[31px]"}
          priority
        />
      </span>
      <span className={`leading-[1.25] font-semibold whitespace-nowrap ${d ? "text-[13px]" : "text-[11.5px]"}`}>
        {d ? "Централизованное духовное управление" : "ЦДУМ"}
        <br />
        {d ? "мусульман Пензенской области" : "Пензенской области"}
      </span>
    </Link>
  );
}

const glass = "border border-[color:var(--sky-glass-line)] bg-[color:var(--sky-glass)] backdrop-blur-[10px]";

function Prayers({ times, next }: { times: DayTimes | null; next: PrayerKey | null }) {
  return (
    <ol aria-label="Время намаза сегодня" className={`tnum grid grid-cols-6 gap-[3px] rounded-[20px] p-[5px] ${glass}`}>
      {PRAYER_ORDER.map((key) => {
        const on = next === key;
        return (
          <li
            key={key}
            aria-current={on ? "time" : undefined}
            className={`flex h-[54px] flex-col items-center justify-center rounded-cell ${on ? "bg-zarya" : ""}`}
          >
            <span
              className={`text-[9.5px] font-semibold tracking-[0.06em] uppercase ${on ? "text-[#3A1F18]" : "text-[color:var(--sky-glass-muted)]"}`}
            >
              {PRAYER_NAMES[key]}
            </span>
            <span
              className={`mt-0.5 text-[15.5px] ${on ? "font-bold text-on-gold" : "font-semibold text-[color:var(--sky-glass-text)]"}`}
            >
              {times ? formatTime(times[key]) : "—:—"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const ACTIONS: { href: string; label: string; icon: IconName }[] = [
  { href: "/mosques", label: "Мечети рядом", icon: "mosques" },
  { href: "/vopros-imamu", label: "Вопрос имаму", icon: "ask-imam" },
  { href: "/obryady", label: "Обряды", icon: "rites" },
];

function Center({ clock, desktop }: { clock: SkyClock | null; desktop: boolean }) {
  const next = clock?.next;
  return (
    <div className="text-center">
      <p
        style={d(300)}
        className={`reveal tnum min-h-[1.7em] font-medium text-[color:var(--sky-text-2)] uppercase ${
          desktop ? "text-[14px] tracking-[0.14em]" : "text-[10.5px] leading-[1.7] tracking-[0.16em]"
        }`}
      >
        {clock &&
          (desktop ? (
            <>
              Пенза · {formatDate(clock.now)} · {formatHijri(clock.now)}
            </>
          ) : (
            <>
              Пенза · {formatDate(clock.now)}
              <br />
              {formatHijri(clock.now)}
            </>
          ))}
      </p>
      <h1
        style={d(400)}
        className={`reveal font-display leading-[1.15] font-medium text-[color:var(--sky-title)] ${
          desktop ? "mt-5 text-[40px]" : "mt-[46px] text-[27px]"
        }`}
      >
        {next ? PRAYER_UNTIL[next.key] : "Время намаза"}
      </h1>
      <p
        style={d(500)}
        className={`reveal tnum font-count leading-none text-[color:var(--sky-text)] ${
          desktop ? "mt-1 text-[clamp(96px,10.3vw,148px)] tracking-[-0.01em]" : "mt-1.5 text-[62px]"
        }`}
      >
        {clock && next ? formatCountdown(next.at.getTime() - clock.now.getTime()) : "--:--:--"}
      </p>
      <p
        lang="ar"
        dir="rtl"
        style={d(650)}
        className={`reveal min-h-[1.5em] font-ar leading-[1.5] text-[color:var(--sky-accent)] ${desktop ? "mt-0.5 text-[30px]" : "mt-1.5 text-[24px]"}`}
      >
        {next ? PRAYER_NAMES_AR[next.key] : ""}
      </p>
      <p style={d(750)} className="reveal mt-0.5 min-h-5 text-[13.5px] text-[color:var(--sky-text-2)]">
        {next ? `${PRAYER_NAMES[next.key]} в ${formatTime(next.at)}` : ""}
        {clock && !hasTable(clock.now) && <span className="block text-[12px] opacity-80">предварительное время</span>}
      </p>
    </div>
  );
}

/** Небо предыдущего состояния: при смене лежит сверху и растворяется 3 с (styles/motion.css → .sky-out). */
function usePreviousSky(sky: SkyState | undefined) {
  const [prev, setPrev] = useState<SkyState | null>(null);
  const last = useRef<SkyState | null>(null);
  useEffect(() => {
    if (!sky) return;
    const before = last.current;
    last.current = sky;
    if (!before || before === sky) return;
    setPrev(before);
    const t = setTimeout(() => setPrev(null), 3000);
    return () => clearTimeout(t);
  }, [sky]);
  return prev;
}

export function TodaySky() {
  const clock = useSkyClock();
  useApplySky(clock?.sky);
  const sky = clock?.sky ?? "night";
  const prev = usePreviousSky(clock?.sky);
  const angle = clock ? sunAngle(clock.now, clock.times.sunrise, clock.times.maghrib) : null;
  const times = clock?.times ?? null;
  const next = clock?.next.key ?? null;
  const ref = useRef<HTMLElement>(null);
  useSkyParallax(ref);

  // Небо ушло с экрана — мерцание и параллакс стоят (DESIGN.md → «Движение»).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-offscreen", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={HERO_ID}
      data-sky={sky}
      data-shifting={prev ? "" : undefined}
      aria-label="Небо над Пензой и время намаза"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#0C1128] md:h-[clamp(720px,100svh,1000px)]"
    >
      {clock && (
        <>
          <SkyGraphic
            animated
            state={sky}
            frame="phone"
            sunAngle={angle}
            className="absolute inset-0 size-full md:hidden"
          />
          <SkyGraphic
            animated
            state={sky}
            frame="desktop"
            sunAngle={angle}
            className="absolute inset-0 size-full max-md:hidden"
          />
          {prev && (
            <>
              <SkyGraphic
                state={prev}
                frame="phone"
                sunAngle={angle}
                className="sky-out absolute inset-0 size-full md:hidden"
              />
              <SkyGraphic
                state={prev}
                frame="desktop"
                sunAngle={angle}
                className="sky-out absolute inset-0 size-full max-md:hidden"
              />
            </>
          )}
        </>
      )}

      {/* Телефон: координаты от верха кадра 844 минус системная зона 47 px. */}
      <div className="md:hidden">
        <header
          style={d(200)}
          className="reveal absolute inset-x-5 top-[calc(env(safe-area-inset-top)+9px)] z-10 flex h-11 items-center"
        >
          <Brand size="phone" />
        </header>
        <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+89px)] z-[5]">
          <Center clock={clock} desktop={false} />
        </div>
        <div
          style={d(1000)}
          className="reveal absolute inset-x-3 bottom-[calc(120px+env(safe-area-inset-bottom))] z-[6]"
        >
          <Prayers times={times} next={next} />
        </div>
      </div>

      {/* Компьютер: кадр 1440×900. */}
      <div className="max-md:hidden">
        <header
          style={d(200)}
          className="reveal absolute inset-x-0 top-0 z-10 flex h-[92px] items-center justify-between gap-6 px-12"
        >
          <Brand size="desktop" />
          <nav aria-label="Основное меню" className="hidden xl:block">
            <ul className="flex gap-[30px] text-[15px] font-medium text-[color:var(--sky-text)] opacity-90">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-11 items-center hover:opacity-100">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex gap-2.5">
            <Link
              href="/dobro"
              className="inline-flex h-[46px] items-center gap-2 rounded-full bg-zarya px-[22px] text-[14.5px] font-bold text-on-gold"
            >
              <Icon name="light-star" className="size-[18px]" />
              Зажечь звезду
            </Link>
          </div>
        </header>
        <div className="absolute inset-x-0 top-[224px] z-[5]">
          <Center clock={clock} desktop />
        </div>
        <div
          style={d(1000)}
          className="reveal absolute inset-x-12 bottom-9 z-[6] grid grid-cols-[1.6fr_1fr] gap-3 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]"
        >
          <Prayers times={times} next={next} />
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex h-[66px] items-center gap-2.5 rounded-[18px] px-[18px] text-[15px] font-semibold text-[color:var(--sky-glass-text)] max-xl:hidden ${glass}`}
            >
              <Icon name={a.icon} className="size-[22px] text-[color:var(--sky-glass-icon)]" />
              {a.label}
            </Link>
          ))}
          <Link
            href="/dobro"
            className="flex h-[66px] items-center gap-2.5 rounded-[18px] bg-zarya px-[18px] text-[15px] font-semibold text-on-gold"
          >
            <Icon name="light-star" className="size-[22px]" />
            Небо добрых дел
          </Link>
        </div>
      </div>
    </section>
  );
}
