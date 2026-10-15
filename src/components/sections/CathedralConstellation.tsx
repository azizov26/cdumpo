import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Example } from "@/components/ui/Tag";
import { Constellation, CONSTELLATION_TOTAL } from "@/components/sky/Constellation";
import { cathedralExample } from "@/mocks/home";

/** Панель созвездия (эталон .const-panel): всегда ночная, в обеих темах. */
export function CathedralConstellation() {
  const { lit, percent } = cathedralExample;
  return (
    <section aria-labelledby="cathedral-title" className="container-site pt-10 md:pt-20">
      <div
        data-theme="dark"
        className="relative grid items-center gap-5 overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_70%_60%,#1B2658_0%,#0B1636_70%)] p-5 text-light md:p-10 lg:grid-cols-[440px_1fr] lg:p-14"
      >
        <div className="relative z-10">
          <p className="eyebrow">Строим всем миром</p>
          <h2 id="cathedral-title" className="mt-2 font-display text-[32px] leading-none font-medium lg:text-[52px] lg:leading-[1.02]">
            Соборная мечеть <em className="text-gold-soft">Пензы</em>
          </h2>
          <p className="mt-3.5 text-[15px] leading-[1.55] text-light/75 lg:text-[17px]">
            Каждое пожертвование зажигает звезду. Созвездие собирается снизу вверх — от фундамента к куполу и полумесяцу.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 lg:mt-7">
            <div className="rounded-card border border-light/12 bg-white/6 px-[18px] py-4">
              <dt className="text-[12.5px] text-light/62">Звёзд зажжено</dt>
              <dd className="tnum font-display text-[36px] leading-[1.1] font-semibold text-gold-pale lg:text-[44px]">
                {lit} <span className="text-[20px] text-light/62 lg:text-[22px]">из {CONSTELLATION_TOTAL}</span>
              </dd>
            </div>
            <div className="rounded-card border border-light/12 bg-white/6 px-[18px] py-4">
              <dt className="text-[12.5px] text-light/62">Собрано</dt>
              <dd className="tnum font-display text-[36px] leading-[1.1] font-semibold text-gold-pale lg:text-[44px]">{percent}%</dd>
            </div>
          </dl>
          <p className="mt-2.5 text-light/80">
            <Example />
          </p>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-7">
            <Button href="/dobro" variant="gold">
              <Icon name="light-star" />
              Зажечь звезду
            </Button>
            <Button href="/dobro/otchyoty">Отчёт о стройке</Button>
          </div>
        </div>
        <Constellation lit={lit} newest className="w-full max-w-[600px] max-lg:row-start-1 lg:justify-self-end" />
      </div>
    </section>
  );
}
