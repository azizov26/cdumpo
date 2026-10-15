import Image from "next/image";
import Link from "next/link";

/** Цвет текста наследуется (currentColor): на небе — --sky-text, в подвале — --paper. */
export function Logo({ full = false }: { full?: boolean }) {
  return (
    <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="ЦДУМ ПО — на главную">
      {/* Растровый оригинал с текущего сайта; ждём вектор от муфтията. */}
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white">
        <Image src="/brand/logo.png" alt="" width={747} height={709} sizes="40px" className="h-auto w-[38px]" priority />
      </span>
      {full ? (
        <span className="max-w-[17rem] text-[13px] leading-tight font-semibold">
          Централизованное духовное управление мусульман Пензенской области
        </span>
      ) : (
        <span className="text-[13px] leading-tight font-semibold">
          ЦДУМ
          <span className="block font-normal opacity-80">Пензенской области</span>
        </span>
      )}
    </Link>
  );
}
