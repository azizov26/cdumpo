// Реестр разделов сайта: навигация, заглушки «раздел готовится», sitemap.
// Когда раздел сверстан — создать для него настоящий page.tsx и поставить ready: true
// (настоящий маршрут всегда важнее заглушки [...slug]).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cdumpo.ru").replace(/\/$/, "");
export const SITE_NAME = "ЦДУМ ПО";
export const SITE_FULL_NAME = "Централизованное духовное управление мусульман Пензенской области";
export const SITE_ADDRESS = "г. Пенза, ул. Бакунина, 10";

/** Яндекс Метрика и подтверждение Вебмастера старого сайта — сохранены, чтобы не потерять статистику (PRODUCT.md). */
export const METRIKA_ID = 88046743;
export const YANDEX_VERIFICATION = "399d147aa44ddd4d";

export type Section = {
  href: string;
  /** Короткое название — в меню и заголовке. */
  title: string;
  /** Что здесь будет — для заглушки и описания страницы. */
  about: string;
  ready?: boolean;
};

export const SECTIONS: Section[] = [
  { href: "/namaz", title: "Время намаза", about: "Расписание на сегодня, неделю и месяц, кибла и напоминания." },
  { href: "/mosques", title: "Мечети", about: "Мечети Пензы и области на карте: адрес, имам, время джума, как проехать." },
  { href: "/dobro", title: "Небо добрых дел", about: "Строительство Соборной мечети Пензы: созвездие, этапы стройки и пожертвования." },
  { href: "/dobro/sadaka", title: "Садака по пятницам", about: "Регулярная садака и её назначение." },
  { href: "/dobro/zakyat", title: "Закят", about: "Калькулятор закята и категории получателей." },
  { href: "/dobro/otchyoty", title: "Отчёты о сборах", about: "Ежемесячные отчёты: сколько собрано и на что пошли средства." },
  { href: "/znaniya", title: "Знания", about: "Лекции, видео и материалы для изучения религии." },
  { href: "/umma", title: "Жизнь уммы", about: "Новости муфтията и общин области, обращения, видео и фотографии." },
  { href: "/muftiyat", title: "О ЦДУМ ПО", about: "История и миссия муфтията, муфтий, структура управления." },
  { href: "/muftiyat/istoriya", title: "История муфтията", about: "История Централизованного духовного управления мусульман Пензенской области." },
  { href: "/muftiyat/struktura", title: "Структура и имамы", about: "Структура управления и имамы мечетей области." },
  { href: "/muftiyat/dokumenty", title: "Документы", about: "Официальные документы муфтията." },
  { href: "/muftiyat/kontakty", title: "Контакты и СМИ", about: "Адрес, телефоны, электронная почта, социальные сети и контакты для СМИ." },
  { href: "/vopros-imamu", title: "Вопрос имаму", about: "Задайте вопрос имаму и получите ответ." },
  { href: "/obryady", title: "Обряды и запись", about: "Никах, имянаречение, джаназа: как проходит и как записаться." },
  { href: "/politika", title: "Политика обработки персональных данных", about: "Как сайт обращается с персональными данными посетителей." },
  { href: "/eshchyo", title: "Ещё", about: "Все разделы сайта.", ready: true },
];

export const sectionByPath = (path: string) => SECTIONS.find((s) => s.href === path);

/** Главное меню (компьютер: шапка; телефон: нижняя панель, кроме «Знаний» и «Жизни уммы» — они в «Ещё»). */
export const NAV = [
  { href: "/namaz", label: "Намаз" },
  { href: "/mosques", label: "Мечети" },
  { href: "/dobro", label: "Добро" },
  { href: "/znaniya", label: "Знания" },
  { href: "/umma", label: "Жизнь уммы" },
  { href: "/muftiyat", label: "Муфтият" },
];

/** Группы экрана «Ещё» (концепция 2.0, вкладка «Ещё»). */
export const MORE_GROUPS: { title: string; hrefs: string[] }[] = [
  { title: "Жизнь общины", hrefs: ["/umma", "/znaniya", "/vopros-imamu", "/obryady"] },
  { title: "Добро", hrefs: ["/dobro", "/dobro/sadaka", "/dobro/zakyat", "/dobro/otchyoty"] },
  { title: "Муфтият", hrefs: ["/muftiyat", "/muftiyat/struktura", "/muftiyat/dokumenty", "/muftiyat/kontakty"] },
];

/** Пункт меню активен на своей странице и на вложенных (/dobro → /dobro/sadaka). */
export const isActive = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
