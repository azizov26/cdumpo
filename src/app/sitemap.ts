import type { MetadataRoute } from "next";
import { SECTIONS, SITE_URL } from "@/lib/site";

// В карту сайта — только готовые страницы; заглушки разделов закрыты от индексации.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...SECTIONS.filter((s) => s.ready).map((s) => ({
      url: `${SITE_URL}${s.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
