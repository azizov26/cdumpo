import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { DonationsLedger } from "@/components/dobro/DonationsLedger";
import { FridayStones } from "@/components/dobro/FridayStones";
import { campaignProgress, formatRub, getCathedralCampaign } from "@/lib/content/cathedral";
import { getDonations, getDonationStats, toLedgerRows } from "@/lib/content/donations";

export const metadata: Metadata = {
  title: "Все поступления — Соборная мечеть Пензы",
  description:
    "Каждое пожертвование на Соборную мечеть Пензы — камень в её стенах: когда, сколько и каким способом. Имена жертвователей не публикуются.",
  alternates: { canonical: "/dobro/postupleniya" },
};

export default async function DonationsPage() {
  const [{ items, isExample }, stats, campaign] = await Promise.all([
    getDonations(),
    getDonationStats(),
    getCathedralCampaign(),
  ]);
  const pct = Math.round(campaignProgress(campaign) * 100);

  return (
    <>
      <PageHeading
        title="Все поступления"
        lead="Каждое пожертвование — камень в стенах Соборной мечети. Здесь видно каждый: когда, сколько и каким способом. Имена не показываем."
      >
        <nav aria-label="Навигационная цепочка" className="mb-4 text-[14px] text-fg-3">
          <Link href="/dobro" className="hover:text-fg">
            Камень к камню
          </Link>
          <span aria-hidden="true"> · </span>
          <span aria-current="page">Все поступления</span>
        </nav>
      </PageHeading>

      <div className="container-site pt-8 md:pt-10">
        <dl className="grid gap-3 sm:grid-cols-3">
          {[
            {
              k: "Собрано на стройку",
              v: formatRub(campaign.collected),
              s: `из ${formatRub(campaign.goal)} · ${pct}%`,
            },
            { k: "Пожертвований в октябре", v: stats.monthCount.toLocaleString("ru-RU"), s: formatRub(stats.monthSum) },
            { k: "Каждую пятницу", v: String(stats.fridaySubscribers), s: "человек в пятничном ряду" },
          ].map((x) => (
            <div key={x.k} className="rounded-[20px] border border-line bg-surface p-5">
              <dt className="text-[13px] font-semibold tracking-[0.06em] text-fg-3 uppercase">{x.k}</dt>
              <dd className="mt-2 font-display text-[36px] leading-none font-medium">{x.v}</dd>
              <dd className="mt-1.5 text-[14px] text-fg-2">{x.s}</dd>
            </div>
          ))}
        </dl>

        {(isExample || stats.isExample) && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-chip px-4 py-2 text-[14px] text-chip-fg">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
            Пример: поступления и суммы условные — так раздел будет выглядеть после открытия сбора
          </p>
        )}
      </div>

      <section aria-labelledby="ledger-title" className="container-site pt-10 md:pt-14">
        <h2 id="ledger-title" className="sr-only">
          Лента поступлений
        </h2>
        <DonationsLedger rows={toLedgerRows(items)} />
      </section>

      <div className="container-site pt-14 pb-20 md:pt-20 md:pb-28">
        <FridayStones stats={stats} open={campaign.open} />
      </div>
    </>
  );
}
