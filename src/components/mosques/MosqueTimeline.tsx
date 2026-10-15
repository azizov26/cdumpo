import type { TimelineEvent } from "@/lib/content/mosques";

/** Хроника двух мечетей одной линией: историческая — кольцо, Соборная — золотая точка. */
export function MosqueTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-5 text-[14px] text-fg-2">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-full border-2 border-accent" />
          Историческая мечеть
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-full bg-zarya" />
          Соборная мечеть
        </span>
      </div>
      <ol className="relative mt-6 grid gap-0 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line md:grid-cols-2 md:gap-x-14 md:before:hidden">
        {events.map((e) => (
          <li
            key={e.year + e.text}
            className="relative grid grid-cols-[12px_1fr] gap-4 py-3 md:border-t md:border-line md:py-4"
          >
            <span
              aria-hidden="true"
              className={`mt-[7px] size-3 rounded-full ${e.mosque === "historic" ? "border-2 border-accent bg-bg" : "bg-zarya"}`}
            />
            <span>
              <span className="block font-display text-[26px] leading-none font-medium">{e.year}</span>
              <span className="mt-1 block text-[15.5px] leading-[1.45] text-fg-2">{e.text}</span>
              <span className="sr-only">
                {e.mosque === "historic" ? " — историческая мечеть" : " — Соборная мечеть"}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
