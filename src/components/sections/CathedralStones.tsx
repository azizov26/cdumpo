import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Masonry } from "@/components/dobro/Masonry";
import { CampaignTotals } from "@/components/dobro/CampaignTotals";
import { campaignProgress, getCathedralCampaign } from "@/lib/content/cathedral";

/** Соборная мечеть — «Камень к камню»: панель всегда ночная, в обеих темах. */
export async function CathedralStones() {
  const campaign = await getCathedralCampaign();
  return (
    <section aria-labelledby="cathedral-title" className="container-site pt-14 md:pt-24">
      <div
        data-theme="dark"
        className="relative grid items-center gap-6 overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_70%_60%,#1B2658_0%,#0B1636_70%)] p-5 text-light md:p-10 lg:grid-cols-[440px_1fr] lg:p-14"
      >
        <div className="relative z-10">
          <p className="eyebrow">Строим всем миром</p>
          <h2
            id="cathedral-title"
            className="mt-2 font-display text-[32px] leading-none font-medium lg:text-[52px] lg:leading-[1.02]"
          >
            Соборная мечеть <em className="text-gold-soft">Пензы</em>
          </h2>
          <p className="mt-3.5 text-[15px] leading-[1.55] text-light/75 lg:text-[17px]">
            Каждое пожертвование — камень в стенах будущей мечети. Кладка растёт вместе со сбором: от фундамента к
            куполу и полумесяцу.
          </p>
          <CampaignTotals campaign={campaign} className="mt-6" />
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-7">
            <Button href="/dobro" variant="gold">
              <Icon name="stones" />
              Положить свой камень
            </Button>
          </div>
        </div>
        <Masonry
          progress={campaignProgress(campaign)}
          className="w-full max-w-[600px] max-lg:row-start-1 lg:justify-self-end"
        />
      </div>
    </section>
  );
}
