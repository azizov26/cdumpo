import type { ReactNode } from "react";
import { SkyPicture } from "@/components/sky/SkyGraphic";
import type { SkyState } from "@/lib/sky/geometry";

/** Пустой раздел в стиле сайта: маленькое небо с силуэтом + спокойный текст. */
export function EmptyState({
  title,
  children,
  sky = "night",
  action,
}: {
  title: string;
  children?: ReactNode;
  sky?: SkyState;
  action?: ReactNode;
}) {
  return (
    <div className="grid items-center gap-5 overflow-hidden rounded-[24px] border border-line bg-surface p-5 sm:grid-cols-[200px_1fr] md:gap-8 md:p-7">
      <SkyPicture sky={sky} width={400} height={240} className="h-[150px] rounded-m sm:h-[120px]" />
      <div>
        <p className="font-display text-[24px] leading-[1.15] font-semibold md:text-[28px]">{title}</p>
        {children && <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.55] text-fg-2">{children}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
