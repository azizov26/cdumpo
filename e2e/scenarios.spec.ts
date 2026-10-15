import { expect, test } from "@playwright/test";

// Ключевые сценарии посетителя (ROADMAP → этап 11). Заставку «Бисмиллях» пропускаем: ?sky= + reduce-motion.
test.use({ reducedMotion: "reduce" });

test("главная: небо, отсчёт и строка намазов", async ({ page }) => {
  await page.goto("/?sky=day");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("До ");
  // На главной две раскладки (телефон и компьютер), одна скрыта по ширине — берём видимую.
  const row = page.getByLabel("Время намаза сегодня").locator("visible=true");
  await expect(row.getByRole("listitem")).toHaveCount(6);
  await expect(row.locator("[aria-current=time]")).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("главная: тема следует за небом", async ({ page }) => {
  await page.goto("/?sky=night");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("таблица месяца: переключение месяца меняет заголовок и строки", async ({ page }) => {
  await page.goto("/namaz");
  const table = page.locator("#namaz-month table");
  await expect(table).toBeVisible();
  await page.getByRole("button", { name: /^июнь/ }).click();
  await expect(page.getByRole("heading", { name: /в июне/ })).toBeVisible();
  await expect(table.getByRole("row", { name: /^1 пн/ })).toBeVisible();
  // 30 дней июня + строка начала месяца хиджры
  expect(await table.locator("tbody tr").count()).toBeGreaterThanOrEqual(30);
});

test("страница намаза: день, неделя, переключение дня", async ({ page }) => {
  await page.goto("/namaz");
  await expect(page.getByRole("heading", { level: 1, name: "Время намаза" })).toBeVisible();
  const week = page.getByRole("group", { name: "День недели" });
  await expect(week.getByRole("button")).toHaveCount(7);
  const times = page.getByRole("list", { name: "Время намаза" });
  await expect(times.getByRole("listitem")).toHaveCount(6);
  await week.getByRole("button").first().click();
  await expect(week.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Следующая неделя" }).click();
  await expect(page.getByRole("button", { name: "К сегодняшнему дню" })).toBeVisible();
});

test("навигация: раздел-заглушка и «Ещё»", async ({ page }) => {
  await page.goto("/eshchyo");
  await page.getByRole("main").getByRole("link", { name: "Садака по пятницам" }).click();
  await expect(page).toHaveURL(/\/dobro\/sadaka$/);
  await expect(page.getByRole("heading", { level: 1, name: "Садака по пятницам" })).toBeVisible();
  await expect(page.getByText("Раздел готовится")).toBeVisible();
});

test("404: страница в стиле сайта", async ({ page }) => {
  const res = await page.goto("/takoj-stranicy-net");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Страница не найдена" })).toBeVisible();
  await page.getByRole("main").getByRole("link", { name: "На главную" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("контакты: адрес известен, остальное помечено", async ({ page }) => {
  await page.goto("/muftiyat/kontakty");
  await expect(page.getByRole("main").getByText("г. Пенза, ул. Бакунина, 10")).toBeVisible();
  await expect(page.getByText("[уточнить: телефон приёмной]")).toBeVisible();
  await expect(page.getByRole("link", { name: "Как проехать" })).toHaveAttribute("href", /yandex\.ru\/maps/);
});

test("SEO: robots, sitemap, метатеги", async ({ page, request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://cdumpo.ru/sitemap.xml");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://cdumpo.ru/namaz</loc>");
  expect(sitemap).not.toContain("/dobro/sadaka"); // заглушки не индексируем
  await page.goto("/dobro/sadaka");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.goto("/namaz");
  await expect(page).toHaveTitle(/Время намаза в Пензе/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og\.png$/);
});

test("без горизонтальной прокрутки на ключевых страницах", async ({ page }) => {
  for (const path of ["/", "/namaz", "/umma", "/muftiyat", "/muftiyat/kontakty", "/eshchyo"]) {
    await page.goto(`${path}?sky=day`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
