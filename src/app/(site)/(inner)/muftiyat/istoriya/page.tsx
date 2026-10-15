import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { FactList, Pending } from "@/components/sections/FactList";
import { SOURCES } from "@/lib/content/mosques";
import { SITE_FULL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "История муфтията",
  description:
    "История Централизованного духовного управления мусульман Пензенской области: чем занимается муфтият, Соборная мечеть и общественная работа.",
  alternates: { canonical: "/muftiyat/istoriya" },
};

// Только подтверждённое открытыми источниками и материалами cdumpo.ru. Год основания, этапы и преемственность
// руководства в открытых источниках противоречивы — их даёт муфтият (docs/zapros-muftiyatu.md), до этого — пометки.
const ACTIVITIES = [
  {
    title: "Молитва и общины",
    text: "Муфтият объединяет мусульманские общины области, работает при Исторической мечети на ул. Бакунина и ведёт Соборную мечеть на проспекте Победы.",
  },
  {
    title: "Духовная работа в исправительных учреждениях",
    text: "Муфтий и имамы бывают в колониях и следственных изоляторах области вместе с представителями других традиционных конфессий и УФСИН.",
  },
  {
    title: "Межрелигиозный диалог и общество",
    text: "Муфтий — член Общественной палаты Пензенской области, участвует в совещаниях с властями, в том числе по организации хаджа, и в межконфессиональных мероприятиях.",
  },
  {
    title: "Просвещение",
    text: "Лекции, женские и региональные ифтары в Соборной мечети, конкурсы для детей, при мечети создаётся духовно-просветительский центр.",
  },
];

export default function HistoryPage() {
  return (
    <>
      <PageHeading
        title="История муфтията"
        lead="Чем занимается муфтият Пензы, какие вехи уже подтверждены источниками и что мы ещё уточняем."
      />
      <div className="container-site grid gap-12 pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="max-w-[860px] space-y-12">
          <section aria-labelledby="who" className="space-y-4">
            <h2 id="who" className="font-display text-[28px] leading-tight font-medium md:text-[34px]">
              Кто мы
            </h2>
            <p className="max-w-[68ch] text-[17px] leading-[1.6]">
              {SITE_FULL_NAME} — «Муфтият Пензы». Его возглавляет муфтий Уразаев Асият Джафарович (Асият-хазрат
              Уразаев). Управление — при Исторической мечети на ул. Бакунина, 10, которая служит общине с 1895 года.
            </p>
            <FactList
              items={[
                { term: "Год основания", value: <Pending what="год создания управления — от муфтията" /> },
                { term: "Предыдущие муфтии", value: <Pending what="имена и годы руководства — от муфтията" /> },
                { term: "Миссия", value: <Pending what="формулировка миссии — от муфтията" /> },
              ]}
            />
          </section>

          <section aria-labelledby="doing" className="space-y-5">
            <h2 id="doing" className="font-display text-[28px] leading-tight font-medium md:text-[34px]">
              Чем занимается муфтият
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {ACTIVITIES.map((a) => (
                <li key={a.title} className="rounded-card border border-line bg-surface p-5">
                  <h3 className="text-[16px] font-semibold">{a.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.5] text-fg-2">{a.text}</p>
                </li>
              ))}
            </ul>
            <p className="text-[15px] text-fg-2">
              Подробности — в{" "}
              <Link href="/umma" className="font-semibold text-accent underline underline-offset-4">
                новостях «Жизнь уммы»
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="mosques" className="space-y-4">
            <h2 id="mosques" className="font-display text-[28px] leading-tight font-medium md:text-[34px]">
              Две мечети
            </h2>
            <p className="max-w-[68ch] text-[17px] leading-[1.6]">
              Историческая мечеть передана общине в 1895 году, закрыта в 1929-м и возвращена в 1991-м. Соборная мечеть
              на проспекте Победы строилась с 2010 года, с 2019-го стройку вело ЦДУМ, а 11 сентября 2026 года мечеть
              открыли.
            </p>
            <Link href="/mosques" className="inline-block font-semibold text-accent underline underline-offset-4">
              Полная история мечетей и хронология
            </Link>
          </section>

          <section aria-labelledby="sources" className="space-y-3">
            <h2 id="sources" className="text-[18px] font-semibold">
              Источники
            </h2>
            <ul className="space-y-2 text-[15px]">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener noreferrer" className="text-accent underline underline-offset-4">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[14px] text-fg-2">
              Историю самого управления — год основания, этапы, прежних муфтиев — мы публикуем после согласования с
              муфтиятом.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
