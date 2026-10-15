import { campaignProgress, formatRub, type CathedralCampaign } from "@/lib/content/cathedral";

/** Собрано / цель / доля — для ночной панели сбора. Пока цифры условные — с пометкой «пример». */
export function CampaignTotals({ campaign, className = "" }: { campaign: CathedralCampaign; className?: string }) {
  const pct = Math.round(campaignProgress(campaign) * 100);
  return (
    <div className={className}>
      <p className="font-display text-[44px] leading-none font-medium lg:text-[56px]">
        {formatRub(campaign.collected)}
      </p>
      <p className="mt-2 text-[15px] text-light/75">
        собрано из {formatRub(campaign.goal)} · {pct}%
      </p>
      <div
        role="progressbar"
        aria-label="Собрано на строительство"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="mt-4 h-1 overflow-hidden rounded-full bg-white/10"
      >
        <div className="h-full rounded-full bg-gold-soft" style={{ width: `${pct}%` }} />
      </div>
      {(campaign.isExample || !campaign.open) && (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-light/15 bg-white/6 px-4 py-2 text-[14px] text-light/85">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gold-soft" />
          {campaign.isExample
            ? "Цифры — пример. Сбор откроется после подготовки реквизитов"
            : "Сбор откроется после подготовки реквизитов"}
        </p>
      )}
    </div>
  );
}
