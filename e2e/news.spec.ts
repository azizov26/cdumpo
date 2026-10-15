import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Новости из админки: опубликованная видна в ленте и на своей странице, черновик — нет.
// Временные записи создаются через REST сервера (чтобы сработал сброс кэша) и удаляются в конце.
// Обе группы устройств идут параллельно, поэтому заголовки у каждой свои.
test.describe.configure({ mode: "serial" });

const PASSWORD = "E2e-pass-12345!";
const paragraph = (text: string) => ({
  root: {
    type: "root",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    children: [
      {
        type: "paragraph",
        version: 1,
        direction: "ltr",
        format: "",
        indent: 0,
        textFormat: 0,
        children: [{ type: "text", version: 1, text, format: 0, detail: 0, mode: "normal", style: "" }],
      },
    ],
  },
});

let token = "";
const created: (number | string)[] = [];
let base = "";
let EMAIL = ""; // e2e-<проект>@test.local, см. e2e/support/cms-user.ts

test.beforeAll(async ({ baseURL }, info) => {
  base = baseURL!;
  EMAIL = `e2e-${info.project.name}@test.local`;
  const res = await fetch(`${base}/api/users/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  token = (await res.json()).token;
  expect(token).toBeTruthy();
});

test.afterAll(async () => {
  for (const id of created) {
    await fetch(`${base}/api/news/${id}`, { method: "DELETE", headers: { Authorization: `JWT ${token}` } });
  }
});

async function createNews(data: Record<string, unknown>) {
  const res = await fetch(`${base}/api/news`, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  expect(res.status, JSON.stringify(json)).toBe(201);
  created.push(json.doc.id);
  return json.doc as { id: number; slug: string };
}

test("опубликованная новость видна в ленте и на странице, черновик — нет", async ({ page }, info) => {
  const tag = info.project.name;
  const title = `Проверочная новость ${tag}`;
  const draftTitle = `Черновик ${tag}`;
  const pub = await createNews({
    title,
    lead: "Лид проверочной новости.",
    rubric: "Муфтият",
    body: paragraph("Текст проверочной новости."),
    _status: "published",
  });
  const draft = await createNews({ title: draftTitle, rubric: "Муфтият", _status: "draft" });

  await page.goto("/umma");
  await expect(page.getByRole("link", { name: title })).toBeVisible();
  await expect(page.getByText(draftTitle)).toHaveCount(0);

  await page.getByRole("link", { name: title }).click();
  await expect(page).toHaveURL(new RegExp(`/umma/${pub.slug}$`));
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  await expect(page.getByText("Текст проверочной новости.")).toBeVisible();

  // Адрес новости рендерится частично заранее, поэтому код ответа 200, но страница — «не найдено» и noindex.
  await page.goto(`/umma/${draft.slug}`);
  await expect(page.getByText("Такой страницы нет")).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();

  // Доступность готовой страницы новости.
  await page.goto(`/umma/${pub.slug}`);
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});

test("снятая с публикации новость пропадает с сайта", async ({ page }, info) => {
  const title = `Временная новость ${info.project.name}`;
  const item = await createNews({ title, rubric: "Муфтият", _status: "published" });
  await page.goto(`/umma/${item.slug}`);
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();

  const res = await fetch(`${base}/api/news/${item.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", Authorization: `JWT ${token}` },
    body: JSON.stringify({ _status: "draft" }),
  });
  expect(res.status).toBe(200);
  await page.goto(`/umma/${item.slug}`);
  await expect(page.getByText("Такой страницы нет")).toBeVisible();
});

test("админка: вход сотрудника и форма новости на русском", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator("#field-email").fill(EMAIL);
  await page.locator("#field-password").fill(PASSWORD);
  await page.locator("button[type=submit]").click();
  await expect(page.getByRole("heading", { name: "Жизнь уммы" })).toBeVisible();

  await page.goto("/admin/collections/news/create");
  await expect(page.getByRole("textbox", { name: /Заголовок/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Сохранить черновик" })).toBeVisible();
});
