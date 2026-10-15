import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const columns = [
  {
    title: "Верующим",
    links: [
      { href: "/namaz", label: "Время намаза" },
      { href: "/mosques", label: "Мечети" },
      { href: "/vopros-imamu", label: "Вопрос имаму" },
      { href: "/obryady", label: "Обряды" },
    ],
  },
  {
    title: "Добро",
    links: [
      { href: "/dobro", label: "Камень к камню" },
      { href: "/dobro/postupleniya", label: "Все поступления" },
      { href: "/dobro/sadaka", label: "Садака по пятницам" },
      { href: "/zakyat", label: "Закят" },
      { href: "/dobro/otchyoty", label: "Отчёты" },
    ],
  },
  {
    title: "Муфтият",
    links: [
      { href: "/muftiyat", label: "О ЦДУМ ПО" },
      { href: "/umma", label: "Жизнь уммы" },
      { href: "/muftiyat/dokumenty", label: "Документы" },
      { href: "/muftiyat/kontakty", label: "Контакты" },
    ],
  },
];

/** Подвал (эталон .foot): ночной фон в обеих темах. */
export function Footer() {
  return (
    <footer data-theme="dark" className="bg-night pt-16 pb-28 text-light md:pb-10">
      <div className="container-site">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="ЦДУМ ПО — на главную">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white">
                <Image src="/brand/logo.png" alt="" width={747} height={709} sizes="40px" className="w-[38px]" />
              </span>
              <span className="text-[13px] leading-[1.25] font-semibold">
                Централизованное духовное управление
                <br />
                мусульман Пензенской области
              </span>
            </Link>
            <p className="mt-4 text-[14.5px] text-light/78">г. Пенза, ул. Бакунина, 10</p>
            <div className="mt-6 flex gap-2.5">
              <Link
                href="/dobro"
                className="inline-flex h-[46px] items-center gap-2 rounded-full bg-zarya px-[22px] text-[14.5px] font-bold text-on-gold"
              >
                <Icon name="stones" className="size-[18px]" />
                Положить камень
              </Link>
            </div>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="mb-2 text-[10.5px] font-bold tracking-[0.16em] text-gold-soft uppercase">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-11 items-center text-[14.5px] text-light/78 hover:text-light"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-light/10 pt-6 text-[13px] text-light/62 sm:flex-row sm:justify-between">
          <span>© ЦДУМ ПО, 2026</span>
          <Link href="/politika" className="inline-flex min-h-11 items-center hover:text-light sm:-my-3">
            Политика обработки персональных данных
          </Link>
        </div>
      </div>
    </footer>
  );
}
