import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { CampaignTotals } from "@/components/dobro/CampaignTotals";
import { DonateForm } from "@/components/dobro/DonateForm";
import { Masonry } from "@/components/dobro/Masonry";
import { DonationsLedger } from "@/components/dobro/DonationsLedger";
import { campaignProgress, getCathedralCampaign } from "@/lib/content/cathedral";
import { getDonations, toLedgerRows } from "@/lib/content/donations";

export const metadata: Metadata = {
  title: "Камень к камню — Соборная мечеть Пензы",
  description:
    "Строительство Соборной мечети Пензы: каждое пожертвование — камень в её стенах. Сколько собрано, этапы стройки, как помочь.",
  alternates: { canonical: "/dobro" },
};

const STEPS = [
  { n: "1", title: "Выберите сумму", text: "Разово, каждую пятницу или раз в месяц — как вам удобнее." },
  { n: "2", title: "Оплатите", text: "Через СБП или картой, без регистрации. Имя жертвователя не публикуется." },
  {
    n: "3",
    title: "Камень ляжет в стену",
    text: "Кладка на рисунке растёт вместе со сбором. Каждый месяц — отчёт с фото стройки.",
  },
];

const RULES = [
  "Имена жертвователей скрыты, рейтингов нет",
  "Никаких таймеров и навязчивых окон",
  "Отдельный учёт этого сбора и отчёт каждый месяц",
];

export default async function DobroPage() {
  const [campaign, { items }] = await Promise.all([getCathedralCampaign(), getDonations()]);
  return (
    <>
      <PageHeading
        title="Камень к камню"
        lead="Строим Соборную мечеть Пензы всем миром. Каждое пожертвование — камень в её стенах."
      />

      <div className="container-site pt-8 md:pt-10">
        <section
          aria-label="Ход сбора"
          data-theme="dark"
          className="grid items-center gap-8 overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_70%_60%,#1B2658_0%,#0B1636_70%)] p-5 text-light md:p-10 lg:grid-cols-[380px_1fr] lg:p-14"
        >
          <div>
            <p className="eyebrow">Соборная мечеть Пензы</p>
            <CampaignTotals campaign={campaign} className="mt-4" />
          </div>
          <Masonry progress={campaignProgress(campaign)} interactive demo className="max-lg:row-start-1" />
        </section>
      </div>

      <section aria-labelledby="last-title" className="container-site pt-14 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="last-title" className="font-display text-[32px] leading-none font-medium md:text-[44px]">
            Последние камни
          </h2>
          <Link href="/dobro/postupleniya" className="text-[15px] font-semibold text-accent hover:underline">
            Все поступления →
          </Link>
        </div>
        <div className="mt-6">
          <DonationsLedger rows={toLedgerRows(items.slice(0, 5))} initial={5} more={false} />
        </div>
      </section>

      <section aria-labelledby="how-title" className="container-site pt-14 md:pt-20">
        <h2 id="how-title" className="font-display text-[32px] leading-none font-medium md:text-[44px]">
          Как это устроено
        </h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-[20px] border border-line bg-surface p-5 md:p-6">
              <span className="font-display text-[36px] leading-none text-accent">{s.n}</span>
              <p className="mt-3 text-[17px] font-semibold">{s.title}</p>
              <p className="mt-1.5 text-[15px] leading-[1.55] text-fg-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="vklad"
        aria-labelledby="donate-title"
        className="container-site grid gap-8 pt-14 pb-20 md:pt-20 md:pb-28 lg:grid-cols-[1fr_560px]"
      >
        <div>
          <h2 id="donate-title" className="font-display text-[32px] leading-none font-medium md:text-[44px]">
            Положить свой камень
          </h2>
          <ul className="mt-6 grid gap-3">
            {RULES.map((r) => (
              <li key={r} className="flex gap-3 text-[16px] leading-[1.5] text-fg-2">
                <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <DonateForm open={campaign.open} />
      </section>
    </>
  );
}
