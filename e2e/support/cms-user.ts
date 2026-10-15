// Временный сотрудник для e2e: `E2E_USER=create|delete pnpm payload run e2e/support/cms-user.ts`.
// Запускается из globalSetup/globalTeardown Playwright; в базе после тестов не остаётся.
import config from "@payload-config";
import { getPayload } from "payload";

// По пользователю на проект Playwright: Payload хранит сессии в записи пользователя,
// и одновременные входы под одним логином перезаписывают друг другу список сессий.
const EMAILS = ["e2e-phone@test.local", "e2e-desktop@test.local"];
const PASSWORD = "E2e-pass-12345!";

const payload = await getPayload({ config });
const existing = await payload.find({
  collection: "users",
  where: { email: { in: EMAILS } },
  overrideAccess: true,
});
for (const u of existing.docs) await payload.delete({ collection: "users", id: u.id, overrideAccess: true });

if (process.env.E2E_USER === "create") {
  for (const email of EMAILS) {
    await payload.create({
      collection: "users",
      data: { email, password: PASSWORD, name: "e2e", role: "admin" },
      overrideAccess: true,
    });
  }
}
process.exit(0);
