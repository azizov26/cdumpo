import { execSync } from "node:child_process";

const run = (action: "create" | "delete") =>
  execSync("pnpm payload run e2e/support/cms-user.ts", { env: { ...process.env, E2E_USER: action }, stdio: "pipe" });

export default function globalSetup() {
  run("create");
  return () => run("delete");
}
