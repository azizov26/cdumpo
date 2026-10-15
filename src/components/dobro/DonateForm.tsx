"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";

// Пожертвование в два шага (PRODUCT.md): как часто и сколько → оплата (СБП первой, затем карта).
// Пока нет получателя, реквизитов и оферты — форма показывает выбор, а оплата закрыта.

const FREQ = ["Разово", "Каждую пятницу", "Раз в месяц"] as const;
const PRESETS = [500, 1000, 3000, 10000];

function Segments<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  const group = useId();
  return (
    <fieldset>
      <legend className="text-[14px] font-semibold text-fg-2">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-1.5 rounded-[18px] bg-chip p-1.5">
        {options.map((o) => (
          <label
            key={o}
            className={`relative inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-full px-3.5 text-center text-[14px] font-semibold whitespace-nowrap transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zarya ${
              value === o ? "bg-zarya text-on-gold" : "text-chip-fg hover:bg-white/40"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              name={`${group}-${label}`}
              checked={value === o}
              onChange={() => onChange(o)}
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function DonateForm({
  open,
  initialFreq = "Разово",
  presets = PRESETS,
}: {
  open: boolean;
  initialFreq?: (typeof FREQ)[number];
  presets?: number[];
}) {
  const [freq, setFreq] = useState<(typeof FREQ)[number]>(initialFreq);
  const [amount, setAmount] = useState<number | null>(1000);
  const [custom, setCustom] = useState("");
  const customId = useId();
  const sum = amount ?? (Number(custom.replace(/\D/g, "")) || 0);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-6 rounded-[24px] border border-line bg-surface p-5 md:p-8"
      aria-describedby="donate-closed"
    >
      <Segments label="Как часто" options={FREQ} value={freq} onChange={setFreq} />

      <fieldset>
        <legend className="text-[14px] font-semibold text-fg-2">Сумма</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={amount === p}
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
              className={`min-h-[48px] rounded-full border text-[15px] font-semibold transition-colors duration-200 ${
                amount === p ? "border-transparent bg-zarya text-on-gold" : "border-line text-fg hover:border-fg-3"
              }`}
            >
              {p.toLocaleString("ru-RU")}&nbsp;₽
            </button>
          ))}
        </div>
        <label htmlFor={customId} className="sr-only">
          Своя сумма, рублей
        </label>
        <input
          id={customId}
          inputMode="numeric"
          placeholder="Своя сумма, ₽"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            setAmount(null);
          }}
          className="mt-2 h-[48px] w-full rounded-full border border-line bg-transparent px-5 text-[16px] text-fg placeholder:text-fg-3 focus:border-fg-3 focus:outline-none"
        />
      </fieldset>

      <div className="grid gap-3">
        <button
          type="submit"
          disabled={!open || sum <= 0}
          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-zarya px-6 text-[15px] font-bold text-on-gold transition-colors duration-200 hover:bg-[#f5c08f] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Icon name="stones" className="size-[18px]" />
          {sum > 0 ? `Положить камень — ${sum.toLocaleString("ru-RU")} ₽` : "Положить камень"}
          {freq !== "Разово" && sum > 0 ? (freq === "Каждую пятницу" ? " в пятницу" : " в месяц") : ""}
        </button>
        <p id="donate-closed" className="text-[14px] leading-[1.5] text-fg-2">
          {open
            ? "Оплата через СБП или картой. Имя жертвователя не публикуется."
            : "Приём пожертвований откроется, когда муфтият подготовит реквизиты и оферту. Оплата будет через СБП или картой, без регистрации; имя жертвователя не публикуется."}
        </p>
      </div>
    </form>
  );
}
