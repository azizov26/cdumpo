import { Icon } from "@/components/ui/Icon";

/** «Поделиться»: обычные ссылки на Telegram и VK, без внешних скриптов и счётчиков. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { href: `https://t.me/share/url?url=${u}&text=${t}`, label: "Telegram", icon: "telegram" as const },
    { href: `https://vk.com/share.php?url=${u}&title=${t}`, label: "ВКонтакте", icon: "vk" as const },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-[14px] font-semibold text-fg-2">Поделиться</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-btn-line bg-btn-line-bg px-4 text-[14px] font-semibold transition-[border-color,transform] duration-150 ease-out hover:border-fg-3 active:scale-[0.97]"
        >
          <Icon name={l.icon} className="size-[18px] text-accent" />
          {l.label}
        </a>
      ))}
    </div>
  );
}
