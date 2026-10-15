import type { ReactNode } from "react";

/** Чип эталона: 26 px, Manrope 600 11 px. */
export function Chip({ children, on = false }: { children: ReactNode; on?: boolean }) {
  return (
    <span
      className={`inline-flex h-[26px] items-center rounded-full px-2.5 text-[11px] font-semibold whitespace-nowrap ${
        on ? "bg-chip-on text-chip-on-fg" : "bg-chip text-chip-fg"
      }`}
    >
      {children}
    </span>
  );
}

/** Явная заглушка для данных, которых пока нет (правило из CLAUDE.md). */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-dashed border-current/50 px-1.5 py-0.5 text-[0.9em] text-accent">
      [уточнить: {children}]
    </span>
  );
}

/** Пометка «пример» для цифр с макета концепции. */
export function Example() {
  return (
    <span className="inline-flex h-[22px] items-center rounded-full border border-current/30 px-2 text-[11px] font-semibold opacity-80">
      пример
    </span>
  );
}
