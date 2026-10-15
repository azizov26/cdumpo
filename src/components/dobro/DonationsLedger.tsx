"use client";

import { useState } from "react";

// Лента «каждый камень в стене»: кто (всегда без имени), назначение, когда, сколько, чем оплачено.
// Строки приходят уже отформатированными с сервера. «Показать ещё» добавляет по PAGE строк, новые проявляются.

export type LedgerRow = {
  id: string;
  who: string;
  tag?: string;
  time: string;
  amount: string;
  method: string;
};

const PAGE = 10;

function StoneGlyph() {
  return (
    <svg viewBox="0 0 20 12" aria-hidden="true" className="h-[11px] w-[18px] shrink-0">
      <rect x="0.5" y="0.5" width="19" height="11" rx="2" className="fill-gold-soft" opacity=".9" />
    </svg>
  );
}

export function DonationsLedger({
  rows,
  initial = PAGE,
  more = true,
}: {
  rows: LedgerRow[];
  initial?: number;
  more?: boolean;
}) {
  const [shown, setShown] = useState(initial);
  const visible = rows.slice(0, shown);

  return (
    <div>
      <div
        aria-hidden="true"
        className="hidden grid-cols-[1.1fr_1.6fr_1fr_0.7fr_0.5fr] gap-4 border-b border-line pb-2.5 text-[12px] font-semibold tracking-[0.08em] text-fg-3 uppercase md:grid"
      >
        <span>Жертвователь</span>
        <span>Назначение</span>
        <span>Дата и время</span>
        <span className="text-right">Сумма</span>
        <span>Способ</span>
      </div>
      <ul aria-label="Поступления" className="divide-y divide-line border-b border-line md:border-t-0">
        {visible.map((r, i) => (
          <li
            key={r.id}
            className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-3.5 md:grid-cols-[1.1fr_1.6fr_1fr_0.7fr_0.5fr] md:gap-4 ${
              i >= initial ? "ledger-in" : ""
            }`}
            style={i >= initial ? { animationDelay: `${(i % PAGE) * 30}ms` } : undefined}
          >
            <span className="flex items-center gap-2.5 text-[15.5px] font-semibold">
              <StoneGlyph />
              {r.who}
            </span>
            <span className="text-right text-[16px] font-bold tabular-nums md:order-4">{r.amount}</span>
            <span className="flex flex-wrap items-center gap-2 text-[14.5px] text-fg-2 max-md:col-span-2 md:order-2">
              Соборная мечеть Пензы
              {r.tag && (
                <span className="rounded-full bg-chip px-2.5 py-0.5 text-[12px] font-semibold text-chip-fg">
                  {r.tag}
                </span>
              )}
            </span>
            <span className="text-[13.5px] text-fg-3 tabular-nums md:order-3">{r.time}</span>
            <span className="text-right text-[13.5px] text-fg-3 md:order-5 md:text-left">{r.method}</span>
          </li>
        ))}
      </ul>
      {more && shown < rows.length && (
        <button
          type="button"
          onClick={() => setShown((n) => Math.min(rows.length, n + PAGE))}
          className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-full border border-btn-line bg-btn-line-bg text-[15px] font-bold text-fg transition-colors duration-200 hover:border-fg-3"
        >
          Показать ещё
        </button>
      )}
    </div>
  );
}
