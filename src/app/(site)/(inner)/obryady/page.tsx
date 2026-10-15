import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { FactList, Pending } from "@/components/sections/FactList";

export const metadata: Metadata = {
  title: "Обряды и запись",
  description: "Никах, имянаречение и джаназа: как обратиться в муфтият и что приготовить. Порядок уточняется у имама.",
  alternates: { canonical: "/obryady" },
};

// Порядок и формулировки обрядов даёт муфтият: сайт ничего не объясняет сам, пока текст не согласован (CLAUDE.md).
const RITES = [
  { id: "nikah", title: "Никах", lead: "Заключение брака по шариату." },
  { id: "imya", title: "Имянаречение", lead: "Обряд наречения имени ребёнку." },
  { id: "janaza", title: "Джаназа", lead: "Погребальная молитва и проводы." },
] as const;

export default function RitesPage() {
  return (
    <>
      <PageHeading
        title="Обряды и запись"
        lead="Как обратиться в муфтият за никахом, имянаречением или джаназой. Порядок каждого обряда подтверждает имам."
      />
      <div className="container-site grid gap-12 pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="max-w-[860px] space-y-12">
          <p className="rounded-card border border-line bg-surface p-5 text-[16px] leading-[1.6] md:p-6">
            Случилось горе и нужна джаназа — не ждите ответа через сайт, сразу{" "}
            <Link href="/muftiyat/kontakty" className="font-semibold text-accent underline underline-offset-4">
              позвоните в муфтият
            </Link>
            .
          </p>

          {RITES.map((r) => (
            <section key={r.id} aria-labelledby={r.id} className="space-y-4">
              <h2 id={r.id} className="font-display text-[28px] leading-tight font-medium md:text-[34px]">
                {r.title}
              </h2>
              <p className="max-w-[68ch] text-[17px] leading-[1.6] text-fg-2">{r.lead}</p>
              <FactList
                items={[
                  { term: "Как проходит", value: <Pending what={`порядок обряда «${r.title}» — от имама`} /> },
                  { term: "Что приготовить", value: <Pending what="документы и всё необходимое — от муфтията" /> },
                  { term: "Как записаться", value: <Pending what="телефон, часы приёма или форма записи" /> },
                  { term: "Где проходит", value: <Pending what="мечеть или место — от муфтията" /> },
                ]}
              />
            </section>
          ))}

          <p className="text-[15px] leading-[1.55] text-fg-2">
            Есть вопрос, которого здесь нет, —{" "}
            <Link href="/vopros-imamu" className="font-semibold text-accent underline underline-offset-4">
              спросите имама
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
