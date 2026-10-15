import type { ReactNode } from "react";

/** Список «название — значение» для карточек сведений. Неизвестное значение — пометка [уточнить: …]. */
export function FactList({ items }: { items: { term: string; value: ReactNode }[] }) {
  return (
    <dl className="overflow-hidden rounded-card border border-line bg-surface shadow-card [[data-theme=dark]_&]:shadow-none">
      {items.map((i) => (
        <div key={i.term} className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[220px_1fr] sm:gap-6 md:px-7">
          <dt className="text-[13px] font-semibold tracking-[0.04em] text-fg-2">{i.term}</dt>
          <dd className="text-[16px] leading-[1.5]">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Данных от муфтията ещё нет: видно, чего именно не хватает, и ничего не выдумано. */
export const Pending = ({ what }: { what: string }) => (
  <span className="text-fg-2 italic">[уточнить: {what}]</span>
);
