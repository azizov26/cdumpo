import type { ReactNode } from "react";

/** Заголовок внутренней страницы: h1 Cormorant, при желании — вводная строка. */
export function PageHeading({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="container-site pt-10 md:pt-16">
      {children}
      <h1 className="font-display text-[40px] leading-[1.02] font-medium md:text-[64px]">{title}</h1>
      {lead && <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.55] text-fg-2">{lead}</p>}
    </div>
  );
}
