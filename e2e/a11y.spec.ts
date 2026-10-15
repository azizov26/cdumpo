import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Доступность WCAG 2.1 AA: все страницы и пять состояний неба на главной (DESIGN.md → «Доступность»).
test.use({ reducedMotion: "reduce" });

const SKIES = ["dawn", "day", "asr", "evening", "night"];
const PAGES = ["/namaz", "/umma", "/muftiyat", "/muftiyat/kontakty", "/eshchyo", "/dobro/zakyat", "/net-takoj"];

async function check(page: import("@playwright/test").Page, label: string) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const report = violations.map(
    (v) =>
      `${v.id}: ${v.help} → ${v.nodes
        .slice(0, 3)
        .map((n) => n.target.join(" "))
        .join(" | ")}`,
  );
  expect(report, label).toEqual([]);
}

for (const sky of SKIES) {
  test(`главная, небо «${sky}»`, async ({ page }) => {
    await page.goto(`/?sky=${sky}`);
    await page.waitForTimeout(500);
    await check(page, `/?sky=${sky}`);
  });
}

for (const path of PAGES) {
  for (const sky of ["day", "night"]) {
    test(`${path}, небо «${sky}»`, async ({ page }) => {
      await page.goto(`${path}?sky=${sky}`);
      await page.waitForTimeout(300);
      await check(page, `${path}?sky=${sky}`);
    });
  }
}
