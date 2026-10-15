// Сбор на строительство Соборной мечети — образ «Камень к камню» (решение заказчика, 15.10.2026).
// ПОКА МОК по просьбе заказчика: цифры условные, на сайте помечены как пример (isExample).
// Заменить данными муфтията — позже глобал CathedralMosque в Payload (ROADMAP, этап 9).

export type CathedralCampaign = {
  /** Цель сбора, ₽. */
  goal: number;
  /** Собрано, ₽. */
  collected: number;
  /** Цифры условные — показать пометку «пример». */
  isExample: boolean;
  /** Приём пожертвований открыт (нужны получатель, реквизиты, оферта). */
  open: boolean;
};

export async function getCathedralCampaign(): Promise<CathedralCampaign> {
  return { goal: 40_000_000, collected: 20_000_000, isExample: true, open: false };
}

export const campaignProgress = (c: Pick<CathedralCampaign, "goal" | "collected">) =>
  c.goal > 0 ? Math.max(0, Math.min(1, c.collected / c.goal)) : 0;

/** 20 000 000 → «20 млн ₽», 1 250 000 → «1,25 млн ₽», 350 000 → «350 000 ₽». */
export function formatRub(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн ₽`;
  return `${n.toLocaleString("ru-RU")} ₽`;
}
