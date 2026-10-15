import { cacheLife, cacheTag } from "next/cache";
import { getCms } from "@/lib/cms/payload";

/** Расписание, загруженное в админке: { "2026-10-15": "04:54 06:26 …" }. Нет таблицы — null (берётся встроенная). */
export async function getPrayerDays(): Promise<Record<string, string> | null> {
  "use cache";
  cacheTag("prayer-times");
  cacheLife("hours");
  try {
    const g = await (await getCms()).findGlobal({ slug: "prayer-times", depth: 0 });
    const d = g.days as Record<string, string> | null;
    return d && Object.keys(d).length ? d : null;
  } catch (e) {
    console.error("[cms] расписание:", e instanceof Error ? e.message : e);
    cacheLife({ stale: 0, revalidate: 10, expire: 60 });
    return null;
  }
}
