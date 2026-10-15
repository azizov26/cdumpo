import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Todo } from "@/components/ui/Tag";

/** «Слово муфтия» (эталон .mufti): портрет-заглушка, цитата, имя. */
export function MuftiWord() {
  return (
    <section aria-labelledby="mufti-title" className="container-site pt-14 pb-16 md:pt-24 md:pb-24">
      <div className="grid items-center gap-6 rounded-xl bg-panel-bg p-5 md:grid-cols-[280px_1fr] md:gap-12 md:p-12">
        <div
          role="img"
          aria-label="Фото муфтия появится позже"
          className="flex h-[260px] items-end justify-center rounded-[24px] bg-[linear-gradient(170deg,#3D2D5E,#D9805A_70%,#F2B57C)] pb-4 text-[13px] text-light/70 max-md:max-w-[280px] md:h-[340px]"
        >
          фото муфтия
        </div>
        <div>
          <p id="mufti-title" className="eyebrow">
            Слово муфтия
          </p>
          <blockquote className="mt-3.5 font-display text-[24px] leading-[1.25] font-medium italic md:text-[34px]">
            <Todo>цитата из обращения муфтия</Todo>
          </blockquote>
          <p className="mt-5 text-[15.5px] font-semibold">Асият-хазрат Уразаев</p>
          <p className="text-[12.5px] text-fg-2">Муфтий Пензенской области</p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-7">
            <Button href="/muftiyat" variant="night">
              Все обращения
            </Button>
            {/* [уточнить: ссылка на Telegram-канал] */}
            <Button href="#">
              <Icon name="telegram" />
              Telegram-канал
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
