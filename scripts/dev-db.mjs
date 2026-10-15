// Локальный Postgres без Docker — только для разработки (npm-пакет embedded-postgres, бета).
// Основной путь по CLAUDE.md — docker-compose.yml. Данные лежат в .data/pg (в git не попадают).
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";

const dir = new URL("../.data/pg", import.meta.url).pathname;
const pg = new EmbeddedPostgres({
  databaseDir: dir,
  user: "cdumpo",
  password: "cdumpo",
  port: 5432,
  persistent: true,
  onLog: () => {},
});

if (!existsSync(`${dir}/PG_VERSION`)) await pg.initialise();
await pg.start();
try {
  await pg.createDatabase("cdumpo");
} catch {
  /* база уже есть */
}
console.log("Postgres запущен: postgres://cdumpo:cdumpo@localhost:5432/cdumpo (Ctrl+C — остановить)");

const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
setInterval(() => {}, 1 << 30);
