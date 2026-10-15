import type { ReactNode } from "react";

/** Чип эталона: 26 px, Manrope 600 11 px. */
export function Chip({ children, on = false }: { children: ReactNode; on?: boolean }) {
  return (
    <span
      className={`inline-flex h-[26px] items-center rounded-full px-2.5 text-[12px] font-semibold whitespace-nowrap ${
        on ? "bg-chip-on text-chip-on-fg" : "bg-chip text-chip-fg"
      }`}
    >
      {children}
    </span>
  );
}

/** Тихая пометка «раздел готовится» — когда данных от муфтията ещё нет. */
export function Soon({ children = "Готовится" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-fg-2 italic">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent/70" />
      {children}
    </span>
  );
}
