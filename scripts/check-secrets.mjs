// Не пускает в git ключи и пароли. Без аргументов проверяет проиндексированное (pre-commit);
// с `--all` — все отслеживаемые файлы (CI). Ключи хранятся только локально в .env и передаются лично.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28 });
const all = process.argv.includes("--all");

const files = (all ? git("ls-files") : git("diff", "--cached", "--name-only", "--diff-filter=ACM"))
  .split("\n")
  .filter(Boolean);

const problems = [];

// Файлы с секретами по имени.
const forbiddenName = /(^|\/)(\.env(\..+)?|.*\.(pem|key|p12|pfx|keystore)|id_(rsa|ed25519)|credentials\.json)$/;
for (const f of files) {
  if (forbiddenName.test(f) && !f.endsWith(".env.example"))
    problems.push(`${f}: файл с секретами не должен быть в git`);
}

// Содержимое: известные формы ключей и присвоение значения переменным-секретам.
const patterns = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "приватный ключ"],
  [/\bAKIA[0-9A-Z]{16}\b/, "ключ AWS"],
  [/\bYC[A-Za-z0-9_-]{30,}\b/, "ключ Yandex Cloud"],
  [/\b(ghp|gho|github_pat)_[A-Za-z0-9_]{30,}\b/, "токен GitHub"],
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}\b/, "токен Slack"],
  [/\b\d{8,10}:[A-Za-z0-9_-]{35}\b/, "токен Telegram-бота"],
  [
    /postgres(ql)?:\/\/[^:\s/]+:(?!cdumpo@|cdumpo\b|password\b|\$)[^@\s]{6,}@(?!localhost|127\.0\.0\.1)/,
    "пароль БД в строке подключения",
  ],
  [
    /\b(PAYLOAD_SECRET|S3_SECRET\w*|S3_ACCESS\w*|SECRET_KEY|API_KEY|PASSWORD|TOKEN)\s*[=:]\s*["']?(?!ci-only)[A-Za-z0-9+/_-]{20,}["']?/i,
    "значение секретной переменной",
  ],
];

for (const f of files) {
  if (/\.(png|jpe?g|webp|avif|gif|ico|pdf|woff2?|svg|lock|yaml)$/i.test(f) || f.endsWith("check-secrets.mjs")) continue;
  let text;
  try {
    text = readFileSync(f, "utf8");
  } catch {
    continue;
  }
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const [re, what] of patterns) {
      if (re.test(line)) problems.push(`${f}:${i + 1}: похоже на ${what}`);
    }
  });
}

if (problems.length) {
  console.error("\nВ коммите найдено похожее на секреты:\n" + problems.map((p) => "  • " + p).join("\n"));
  console.error(
    "\nКлючи храним только в локальном .env и передаём лично. Если это ложное срабатывание — скажите, поправим правило.\n",
  );
  process.exit(1);
}
