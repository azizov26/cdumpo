import { cacheLife, cacheTag } from "next/cache";
import { getCms } from "@/lib/cms/payload";

export type SiteContacts = {
  phone?: string;
  email?: string;
  hours?: string;
  pressContact?: string;
  telegram?: string;
  vk?: string;
  banner?: { text: string; link?: string };
};

const clean = (v?: string | null) => v?.trim() || undefined;

/** Контакты и баннер из «Настроек сайта». Пустое поле — undefined: страница покажет [уточнить: …]. */
export async function getSiteSettings(): Promise<SiteContacts> {
  "use cache";
  cacheTag("site-settings");
  cacheLife("hours");
  try {
    const s = await (await getCms()).findGlobal({ slug: "site-settings", depth: 0 });
    return {
      phone: clean(s.phone),
      email: clean(s.email),
      hours: clean(s.hours),
      pressContact: clean(s.pressContact),
      telegram: clean(s.telegram),
      vk: clean(s.vk),
      banner:
        s.bannerEnabled && clean(s.bannerText) ? { text: clean(s.bannerText)!, link: clean(s.bannerLink) } : undefined,
    };
  } catch (e) {
    console.error("[cms] настройки сайта:", e instanceof Error ? e.message : e);
    cacheLife({ stale: 0, revalidate: 10, expire: 60 });
    return {};
  }
}
