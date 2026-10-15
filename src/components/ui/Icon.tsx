// Иконки из спрайта дизайнера (svg/icons/_sprite.svg): 24×24, линия 1.6, currentColor.
const STAR8 =
  "12.00,2.50 14.78,5.28 18.72,5.28 18.72,9.22 21.50,12.00 18.72,14.78 18.72,18.72 14.78,18.72 12.00,21.50 9.22,18.72 5.28,18.72 5.28,14.78 2.50,12.00 5.28,9.22 5.28,5.28 9.22,5.28";

const paths = {
  today: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  namaz: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  mosques: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  dobro: <polygon points={STAR8} />,
  more: <path d="M4 7h16M4 12h16M4 17h10" />,
  "ask-imam": <path d="M4 5h16v11H9l-4 4v-4H4z" />,
  rites: (
    <>
      <circle cx="12" cy="15" r="6" />
      <path d="M9 4h6l-3 5z" />
    </>
  ),
  sadaqa: (
    <>
      <polygon points={STAR8} />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  "light-star": (
    <>
      <polygon points={STAR8} />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  telegram: <path d="M21 4L3 11l7 2.5L12.5 21zM10 13.5L21 4" />,
  vk: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M7 9c.5 3.5 2.5 6 5.5 6v-2.5c1 .2 2 1.2 2.5 2.5H17c-.5-1.8-1.8-3-2.6-3.4.8-.5 1.9-1.7 2.3-3.6h-2c-.4 1.4-1.4 2.6-2.2 2.8V9h-2v5c-1.2-.4-2.2-2-2.4-5z" />
    </>
  ),
  book: <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2 .7 3 2.8 3 6" />
    </>
  ),
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5z" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-[22px]" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {paths[name]}
    </svg>
  );
}
