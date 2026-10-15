import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/PageHeading";
import { Pending } from "@/components/sections/FactList";
import { ZakatCalculator } from "@/components/zakat/ZakatCalculator";

export const metadata: Metadata = {
  title: "Закят: калькулятор",
  description: "Посчитайте закят: имущество, нисаб по цене золота и 2,5 %. Расчёт ориентировочный.",
  alternates: { canonical: "/zakyat" },
};

export default function ZakatPage() {
  return (
    <>
      <PageHeading
        title="Закят"
        lead="Введите, чем вы располагаете, — калькулятор покажет, достигло ли имущество нисаба и сколько составляет закят."
      />
      <div className="container-site pt-8 pb-20 md:pt-12 md:pb-28">
        <ZakatCalculator />
        <div className="mt-12 max-w-[760px] space-y-3 text-[15px] leading-[1.6] text-fg-2">
          <p>
            Расчёт ориентировочный и ничего не отправляет: цифры остаются в вашем браузере. Есть ли закят именно у вас и
            кому его отдать, уточните у имама.
          </p>
          <p>
            Закят платят, если имущество достигло нисаба и пролежало у вас полный лунный год. Правила учёта отдельных
            видов имущества: <Pending what="согласовать формулировки с муфтиятом" />.
          </p>
        </div>
      </div>
    </>
  );
}
