import { getSiteSettings } from "@/lib/content/settings";

/** Объявление из «Настроек сайта» (например, о переносе времени джума). Пока не включено — ничего не рисует. */
export async function AnnouncementBanner() {
  const { banner } = await getSiteSettings();
  if (!banner) return null;
  const isExternal = banner.link && /^https?:\/\//.test(banner.link);
  return (
    <div className="container-site pt-4">
      <p role="status" className="rounded-2xl border border-line bg-surface px-5 py-3 text-[15px] leading-[1.5]">
        {banner.text}
        {banner.link && (
          <>
            {" "}
            <a
              href={banner.link}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-semibold text-accent underline underline-offset-4"
            >
              Подробнее
            </a>
          </>
        )}
      </p>
    </div>
  );
}
