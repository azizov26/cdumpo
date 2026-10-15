import { rng } from "@/lib/sky/geometry";

// Лента поступлений на Соборную мечеть — «каждый камень в стене» (по образцу раздела доноров mechet-rostova.ru).
// ПОКА МОК по просьбе заказчика: поступления условные, на сайте помечены как пример (isExample).
// Позже — выгрузка из платёжного провайдера/Payload. Имена не публикуются никогда (PRODUCT.md → «Правила бережности»).

export type PayMethod = "СБП" | "Карта";

export type Donation = {
  id: string;
  /** ISO-время поступления. */
  at: string;
  amount: number;
  method: PayMethod;
  /** Камень каждую пятницу / раз в месяц. */
  recurring?: "friday" | "monthly";
};

export type FridayRow = { date: string; amount: number; donors: number };

export type DonationStats = {
  /** Сколько человек кладут камень каждую пятницу. */
  fridaySubscribers: number;
  /** Пожертвований за текущий месяц и их сумма. */
  monthCount: number;
  monthSum: number;
  /** Последние пятничные ряды, от ранней к поздней. */
  fridays: FridayRow[];
  isExample: boolean;
};

const AMOUNTS = [100, 200, 300, 500, 500, 500, 1000, 1000, 1000, 1000, 1500, 2000, 3000, 5000, 10000];
// Опорная точка мока — фиксированная: текущее время в серверном рендере ломает пререндер (CLAUDE.md).
const NOW = Date.parse("2026-10-15T12:34:00+03:00");

const MOCK: Donation[] = (() => {
  const r = rng(58);
  const out: Donation[] = [];
  let t = NOW;
  for (let i = 0; i < 64; i++) {
    t -= Math.round((20 + r() * 340) * 60_000); // от 20 минут до ~6 часов между поступлениями
    const x = r();
    out.push({
      id: `d${i}`,
      at: new Date(t).toISOString(),
      amount: AMOUNTS[Math.floor(r() * AMOUNTS.length)],
      method: r() < 0.68 ? "СБП" : "Карта",
      recurring: x < 0.18 ? "friday" : x < 0.26 ? "monthly" : undefined,
    });
  }
  return out;
})();

export async function getDonations(): Promise<{ items: Donation[]; isExample: boolean }> {
  return { items: MOCK, isExample: true };
}

export async function getDonationStats(): Promise<DonationStats> {
  const month = MOCK.filter((d) => d.at.startsWith("2026-10"));
  const fridays: FridayRow[] = [
    { date: "2026-09-04", amount: 41_500, donors: 29 },
    { date: "2026-09-11", amount: 44_000, donors: 31 },
    { date: "2026-09-18", amount: 43_200, donors: 31 },
    { date: "2026-09-25", amount: 47_800, donors: 34 },
    { date: "2026-10-02", amount: 51_300, donors: 36 },
    { date: "2026-10-09", amount: 53_000, donors: 38 },
  ];
  return {
    fridaySubscribers: 38,
    monthCount: month.length,
    monthSum: month.reduce((s, d) => s + d.amount, 0),
    fridays,
    isExample: true,
  };
}

const TZ = "Europe/Moscow";
/** «15 окт 2026 · 12:34» — форматировать на сервере, чтобы не было расхождения при гидратации. */
export function formatDonationTime(iso: string) {
  const d = new Date(iso);
  const date = d
    .toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", timeZone: TZ })
    .replace(" г.", "")
    .replace(".", "");
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
  return `${date} · ${time}`;
}

export const RECURRING_LABEL = { friday: "Каждую пятницу", monthly: "Раз в месяц" } as const;

/** Строки ленты для DonationsLedger: имя жертвователя не показываем никогда. */
export function toLedgerRows(items: Donation[]) {
  return items.map((d) => ({
    id: d.id,
    who: "Анонимно",
    tag: d.recurring ? RECURRING_LABEL[d.recurring] : undefined,
    time: formatDonationTime(d.at),
    amount: `${d.amount.toLocaleString("ru-RU")} ₽`,
    method: d.method,
  }));
}
