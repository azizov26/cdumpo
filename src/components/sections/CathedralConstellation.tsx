import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Constellation } from "@/components/sky/Constellation";

/** Панель созвездия (эталон .const-panel): всегда ночная, в обеих темах. */
export function CathedralConstellation() {
  return (
    <section aria-labelledby="cathedral-title" className="container-site pt-14 md:pt-24">
      <div
        data-theme="dark"
        className="relative grid items-center gap-5 overflow-hidden rounded-xl bg-[radial-gradient(120%_90%_at_70%_60%,#1B2658_0%,#0B1636_70%)] p-5 text-light md:p-10 lg:grid-cols-[440px_1fr] lg:p-14"
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
            Каждое пожертвование зажигает звезду. Созвездие собирается снизу вверх — от фундамента к куполу и
            полумесяцу.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-light/15 bg-white/6 px-4 py-2 text-[14px] text-light/85">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-soft" />
            Сбор средств откроется после подготовки реквизитов
          </p>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-7">
            <Button href="/dobro">
              <Icon name="light-star" />О проекте «Небо добрых дел»
            </Button>
          </div>
        </div>
        <Constellation lit={0} className="w-full max-w-[600px] max-lg:row-start-1 lg:justify-self-end" />
      </div>
    </section>
  );
}
