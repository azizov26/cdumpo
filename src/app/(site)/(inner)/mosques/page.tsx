import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { CathedralMosqueArt, HistoricMosqueArt } from "@/components/mosques/MosqueArt";
import { MosqueStory } from "@/components/mosques/MosqueStory";
import { MosqueTimeline } from "@/components/mosques/MosqueTimeline";
import { CATHEDRAL, HISTORIC, SOURCES, TIMELINE } from "@/lib/content/mosques";

export const metadata: Metadata = {
  title: "Мечети Пензы",
  description:
    "Историческая мечеть на ул. Бакунина, 10 (с 1895 года) и новая Соборная мечеть на проспекте Победы, 75М (открыта в 2026 году): история, адреса, как добраться.",
  alternates: { canonical: "/mosques" },
};

export default function MosquesPage() {
  return (
    <>
      {/* Первый экран: две мечети на одном горизонте, между ними — 131 год. Панель всегда ночная. */}
      <section aria-labelledby="mosques-title" className="container-site pt-6 md:pt-10">
        <div
          data-theme="dark"
          className="relative overflow-hidden rounded-xl bg-[radial-gradient(130%_100%_at_50%_100%,#26305F_0%,#121B45_45%,#0B1636_100%)] px-5 pt-10 text-light md:px-12 md:pt-16"
        >
          <Stars />
          <div className="relative z-10 text-center">
            <p className="eyebrow">Мечети Пензы</p>
            <h1
              id="mosques-title"
              className="mx-auto mt-3 max-w-[16ch] font-display text-[42px] leading-[0.98] font-medium md:text-[76px]"
            >
              Две мечети — <em className="text-gold-soft">131&nbsp;год</em> между ними
            </h1>
            <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-[1.55] text-light/75 md:text-[18px]">
              Историческая мечеть на Бакунина собрала общину в 1895 году. Соборная на проспекте Победы открылась в
              сентябре 2026-го.
            </p>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-2 items-end gap-2 md:mt-12 md:gap-10">
            <a href="#historic" className="group block text-center focus-visible:outline-offset-4">
              <span
                aria-hidden="true"
                className="block font-display text-[56px] leading-none text-light/14 md:text-[140px]"
              >
                1895
              </span>
              <HistoricMosqueArt className="-mt-6 w-full md:-mt-16" />
              <span className="mt-3 mb-5 block text-[14px] font-semibold text-light/85 transition-colors group-hover:text-gold-soft md:text-[16px]">
                ул. Бакунина, 10 ↓
              </span>
            </a>
            <a href="#cathedral" className="group block text-center focus-visible:outline-offset-4">
              <span
                aria-hidden="true"
                className="block font-display text-[56px] leading-none text-gold-soft/22 md:text-[140px]"
              >
                2026
              </span>
              <CathedralMosqueArt className="-mt-6 w-full md:-mt-16" />
              <span className="mt-3 mb-5 block text-[14px] font-semibold text-light/85 transition-colors group-hover:text-gold-soft md:text-[16px]">
                пр. Победы, 75М ↓
              </span>
            </a>
          </div>
          <p className="relative z-10 pb-4 text-center text-[12px] text-light/45">
            Иллюстрации · фото мечетей появятся от муфтията
          </p>
        </div>
      </section>

      <MosqueStory mosque={HISTORIC} />
      <MosqueStory mosque={CATHEDRAL} reverse />

      <section aria-labelledby="timeline-title" className="container-site pt-16 md:pt-24">
        <p className="eyebrow">Хроника</p>
        <h2 id="timeline-title" className="mt-2 font-display text-[34px] leading-none font-medium md:text-[52px]">
          От дома купца Тихомирова <em className="text-accent">до Соборной мечети</em>
        </h2>
        <MosqueTimeline events={TIMELINE} />
      </section>

      <section aria-labelledby="region-title" className="container-site pt-16 md:pt-24">
        <h2 id="region-title" className="font-display text-[34px] leading-none font-medium md:text-[52px]">
          Мечети области
        </h2>
        <div className="mt-6">
          <EmptyState
            title="Карта мечетей области готовится"
            action={
              <Link
                href="/namaz"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-accent hover:underline"
              >
                <Icon name="namaz" className="size-[18px]" />
                Время намаза в Пензе
              </Link>
            }
          >
            Сверяем с муфтиятом адреса, имамов и время джума — после этого здесь появится карта и список мечетей
            Пензенской области.
          </EmptyState>
        </div>
      </section>

      <section aria-labelledby="sources-title" className="container-site pt-12 pb-20 md:pb-28">
        <h2 id="sources-title" className="text-[13px] font-semibold tracking-[0.08em] text-fg-3 uppercase">
          Источники
        </h2>
        <ul className="mt-3 grid gap-1.5 text-[14px] text-fg-2">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/** Неподвижные звёзды первого экрана (детерминированные — без Math.random в рендере). */
function Stars() {
  const pts = Array.from({ length: 70 }, (_, i) => ({
    x: Math.round((i * 137.5) % 1000),
    y: Math.round(((i * 61.8) % 330) + 10),
    r: i % 7 === 0 ? 1.6 : 0.9,
  }));
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 size-full"
      preserveAspectRatio="xMidYMin slice"
      viewBox="0 0 1000 600"
    >
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#FFF6E4" opacity={i % 3 ? 0.45 : 0.85} />
      ))}
    </svg>
  );
}
