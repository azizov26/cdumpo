"use client";

import { useId, useState } from "react";
import { calcZakat, NISAB_GOLD_GRAMS, type ZakatInput } from "@/lib/zakat/calc";

type Key = keyof ZakatInput;

const FIELDS: { key: Key; label: string; hint?: string; unit: "₽" | "г" }[] = [
  {
    key: "goldPrice",
    label: "Цена 1 грамма золота",
    hint: "Возьмите сегодняшний курс в банке — по нему считается нисаб.",
    unit: "₽",
  },
  { key: "cash", label: "Наличные", unit: "₽" },
  { key: "bank", label: "Деньги на счетах и вкладах", unit: "₽" },
  { key: "goldGrams", label: "Золото", hint: "Вес в граммах (чистое золото).", unit: "г" },
  { key: "silverGrams", label: "Серебро", hint: "Вес в граммах.", unit: "г" },
  { key: "silverPrice", label: "Цена 1 грамма серебра", unit: "₽" },
  { key: "trade", label: "Товары для продажи", hint: "По рыночной цене на сегодня.", unit: "₽" },
  { key: "receivable", label: "Долги вам, которые вернут", unit: "₽" },
  { key: "debts", label: "Ваши долги и платежи ближайшего срока", unit: "₽" },
];

const rub = (n: number) => `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n)} ₽`;

export function ZakatCalculator() {
  const id = useId();
  const [v, setV] = useState<Record<Key, string>>({
    goldPrice: "",
    cash: "",
    bank: "",
    goldGrams: "",
    silverGrams: "",
    silverPrice: "",
    trade: "",
    receivable: "",
    debts: "",
  });
  const num = (k: Key) => Number(v[k].replace(/\s/g, "").replace(",", ".")) || 0;
  const r = calcZakat({
    cash: num("cash"),
    bank: num("bank"),
    goldGrams: num("goldGrams"),
    silverGrams: num("silverGrams"),
    trade: num("trade"),
    receivable: num("receivable"),
    debts: num("debts"),
    goldPrice: num("goldPrice"),
    silverPrice: num("silverPrice"),
  });

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_340px] md:items-start">
      <form onSubmit={(e) => e.preventDefault()} className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.key === "goldPrice" ? "sm:col-span-2" : ""}>
            <label htmlFor={`${id}-${f.key}`} className="text-[14px] font-semibold text-fg-2">
              {f.label}
            </label>
            <div className="relative mt-2">
              <input
                id={`${id}-${f.key}`}
                inputMode="decimal"
                autoComplete="off"
                value={v[f.key]}
                onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
                placeholder="0"
                aria-describedby={f.hint ? `${id}-${f.key}-h` : undefined}
                className="h-[48px] w-full rounded-full border border-line bg-transparent pr-12 pl-5 text-[16px] text-fg placeholder:text-fg-3 focus:border-fg-3 focus:outline-none"
              />
              <span aria-hidden className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-fg-3">
                {f.unit}
              </span>
            </div>
            {f.hint && (
              <p id={`${id}-${f.key}-h`} className="mt-1.5 text-[13px] text-fg-3">
                {f.hint}
              </p>
            )}
          </div>
        ))}
      </form>

      <aside aria-live="polite" className="rounded-[24px] border border-line p-6 md:sticky md:top-24">
        <p className="text-[13px] font-semibold tracking-[0.08em] text-fg-3 uppercase">К выплате</p>
        <p className="font-display mt-2 text-[44px] leading-none font-medium">{rub(r.due)}</p>
        <dl className="mt-5 space-y-2 text-[15px] text-fg-2">
          <div className="flex justify-between gap-4">
            <dt>Всего имущества</dt>
            <dd>{rub(r.assets)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>За вычетом долгов</dt>
            <dd>{rub(r.net)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Нисаб ({NISAB_GOLD_GRAMS} г золота)</dt>
            <dd>{r.nisab ? rub(r.nisab) : "—"}</dd>
          </div>
        </dl>
        <p className="mt-5 text-[14px] leading-[1.5] text-fg-2">
          {r.nisab === 0
            ? "Укажите цену грамма золота — без неё нисаб посчитать нельзя."
            : r.reached
              ? "Имущество достигло нисаба: закят — 2,5 % от суммы."
              : "Имущество не достигло нисаба — закят не обязателен."}
        </p>
      </aside>
    </div>
  );
}
