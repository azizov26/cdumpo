import type { ReactNode } from "react";

/** Заголовок секции эталона: .label + .h2 (Cormorant 500 52/1.02, акцент — курсив). */
export function SectionHeading({
  label,
  title,
  accent,
  id,
  action,
}: {
  label: string;
  title: string;
  accent?: string;
  id: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 lg:mb-7">
      <div>
        <p className="eyebrow">{label}</p>
        <h2 id={id} className="mt-2 font-display text-[32px] leading-none font-medium lg:text-[52px] lg:leading-[1.02]">
          {title} {accent && <em className="text-accent">{accent}</em>}
        </h2>
      </div>
      {action}
    </div>
  );
}
