import { defineConfig } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  // Временный сотрудник в Payload для сценариев с новостями; удаляется после прогона.
  globalSetup: "./e2e/support/global-setup.ts",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, locale: "ru-RU", timezoneId: "Europe/Moscow" },
  // Тесты идут по продакшен-сборке: так проверяется то, что увидит посетитель.
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 240_000,
  },
  projects: [
    { name: "phone", use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
});
