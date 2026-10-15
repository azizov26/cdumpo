import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { AskForm } from "@/components/imam/AskForm";

export const metadata: Metadata = {
  title: "Вопрос имаму",
  description: "Задайте вопрос имаму о намазе, посте, закяте, семье и обрядах. Имам ответит лично, можно без имени.",
  alternates: { canonical: "/vopros-imamu" },
};

/** Открыт ли приём вопросов: нужен имам, который отвечает (PRODUCT.md → открытые вопросы, п. 10). */
const OPEN = false;

const STEPS = [
  { n: "1", title: "Вы спрашиваете", text: "Как есть, своими словами. Имя не нужно — только куда прислать ответ." },
  { n: "2", title: "Имам читает сам", text: "Вопрос получает имам муфтията, без посредников и чат-ботов." },
  {
    n: "3",
    title: "Ответ приходит вам",
    text: "На почту или в Telegram. С вашего разрешения — и в архив ниже, без имени.",
  },
];

export default function VoprosImamuPage() {
  return (
    <>
      <PageHeading
        title="Вопрос имаму"
        lead="О намазе, посте, закяте, семье или обрядах — спросите, имам ответит лично. Можно без имени."
      />

      <section aria-label="Задать вопрос" className="container-site pt-8 md:pt-10">
        <AskForm open={OPEN} />
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
        <p className="mt-5 max-w-[70ch] text-[15px] leading-[1.55] text-fg-2">
          Случилось горе и нужна джаназа, или вопрос не терпит ожидания — не ждите ответа,{" "}
          <Link href="/muftiyat/kontakty" className="font-semibold text-accent hover:underline">
            позвоните в муфтият
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="answers-title" className="container-site pt-14 pb-20 md:pt-20 md:pb-28">
        <h2 id="answers-title" className="font-display text-[32px] leading-none font-medium md:text-[44px]">
          Ответы имама
        </h2>
        <div className="mt-6">
          <EmptyState title="Ответов пока нет" sky="evening">
            Здесь появятся вопросы и ответы, которые авторы разрешили опубликовать, — без имён, с поиском по темам.
          </EmptyState>
        </div>
      </section>
    </>
  );
}
