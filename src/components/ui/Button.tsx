import Link from "next/link";
import type { ReactNode } from "react";

// Кнопки эталона: .btn-gold, .btn-night, .btn-line (Manrope 700 14.5, высота 50).
type Variant = "gold" | "night" | "line";

const variants: Record<Variant, string> = {
  gold: "bg-zarya text-on-gold hover:bg-[#f5c08f]",
  night: "bg-night text-light hover:bg-night-3",
  line: "border border-btn-line bg-btn-line-bg text-fg hover:border-fg-3",
};

export function Button({
  href,
  variant = "line",
  children,
  className = "",
  ariaLabel,
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`inline-flex h-[50px] items-center justify-center gap-2 rounded-full px-[22px] text-[14.5px] leading-none font-bold whitespace-nowrap transition-colors duration-200 [&_svg]:size-[18px] ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
