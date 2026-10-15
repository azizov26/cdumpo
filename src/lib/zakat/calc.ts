// Закят с денег и имущества. Нисаб — стоимость 85 г золота; цену грамма вводит сам пользователь (на сайте её не выдумываем).
export const NISAB_GOLD_GRAMS = 85;
export const ZAKAT_RATE = 0.025;

export type ZakatInput = {
  cash: number;
  bank: number;
  goldGrams: number;
  silverGrams: number;
  trade: number;
  receivable: number;
  debts: number;
  goldPrice: number;
  silverPrice: number;
};

export type ZakatResult = {
  assets: number;
  net: number;
  nisab: number;
  reached: boolean;
  due: number;
};

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calcZakat(i: ZakatInput): ZakatResult {
  const assets =
    pos(i.cash) +
    pos(i.bank) +
    pos(i.goldGrams) * pos(i.goldPrice) +
    pos(i.silverGrams) * pos(i.silverPrice) +
    pos(i.trade) +
    pos(i.receivable);
  const net = Math.max(0, assets - pos(i.debts));
  const nisab = NISAB_GOLD_GRAMS * pos(i.goldPrice);
  const reached = nisab > 0 && net >= nisab;
  return { assets, net, nisab, reached, due: reached ? Math.round(net * ZAKAT_RATE * 100) / 100 : 0 };
}
