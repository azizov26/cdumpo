// Разбор таблицы времени намаза из CSV/Excel, загруженной в админке.
// Результат совместим с src/data/prayer-times.json: { "2026-10-15": "04:54 06:26 12:15 14:28 17:04 18:39" }.
export type Cell = string | number | boolean | Date | null | undefined;

const KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
// Допустимые названия столбцов (регистр не важен).
const ALIASES: Record<string, string> = {
  date: "date",
  дата: "date",
  city: "city",
  город: "city",
  fajr: "fajr",
  фаджр: "fajr",
  субх: "fajr",
  sunrise: "sunrise",
  восход: "sunrise",
  шурук: "sunrise",
  dhuhr: "dhuhr",
  зухр: "dhuhr",
  asr: "asr",
  аср: "asr",
  maghrib: "maghrib",
  магриб: "maghrib",
  isha: "isha",
  иша: "isha",
};

const pad = (n: number) => String(n).padStart(2, "0");

function toDate(v: Cell): string | null {
  if (v instanceof Date) return `${v.getUTCFullYear()}-${pad(v.getUTCMonth() + 1)}-${pad(v.getUTCDate())}`;
  const s = String(v ?? "").trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
  if (m) return `${m[3]}-${pad(+m[2])}-${pad(+m[1])}`;
  return null;
}

function toTime(v: Cell): string | null {
  if (v instanceof Date) return `${pad(v.getUTCHours())}:${pad(v.getUTCMinutes())}`;
  if (typeof v === "number" && v >= 0 && v < 1) {
    const mins = Math.round(v * 1440);
    return `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;
  }
  const m = /^(\d{1,2})[:.](\d{2})(?::\d{2})?$/.exec(String(v ?? "").trim());
  if (!m || +m[1] > 23 || +m[2] > 59) return null;
  return `${pad(+m[1])}:${m[2]}`;
}

/** Разбивает CSV на строки; разделитель — запятая или точка с запятой (Excel по-русски), кавычки поддерживаются. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const delim =
    (src.split("\n")[0].match(/;/g)?.length ?? 0) > (src.split("\n")[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delim) {
      row.push(cur);
      cur = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cur);
      cur = "";
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else cur += ch;
  }
  row.push(cur);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

export type ParsedTable = { days: Record<string, string>; errors: string[] };

export function parsePrayerRows(rows: Cell[][], city = "Пенза"): ParsedTable {
  const errors: string[] = [];
  const days: Record<string, string> = {};
  const header = (rows[0] ?? []).map(
    (c) =>
      ALIASES[
        String(c ?? "")
          .trim()
          .toLowerCase()
      ] ?? "",
  );
  const missing = ["date", ...KEYS].filter((k) => !header.includes(k));
  if (missing.length) {
    return {
      days,
      errors: [
        `В первой строке не хватает столбцов: ${missing.join(", ")}. Нужны: date, fajr, sunrise, dhuhr, asr, maghrib, isha.`,
      ],
    };
  }
  const col = (k: string) => header.indexOf(k);
  const cityCol = col("city");

  rows.slice(1).forEach((r, i) => {
    const line = i + 2;
    if (!r.some((c) => String(c ?? "").trim())) return;
    if (cityCol >= 0 && String(r[cityCol] ?? "").trim() && String(r[cityCol]).trim() !== city) return;
    const date = toDate(r[col("date")]);
    if (!date) return void errors.push(`Строка ${line}: не удалось прочитать дату «${String(r[col("date")] ?? "")}».`);
    const times = KEYS.map((k) => toTime(r[col(k)]));
    const bad = KEYS.filter((_, j) => !times[j]);
    if (bad.length) return void errors.push(`Строка ${line} (${date}): не читается время — ${bad.join(", ")}.`);
    const t = times as string[];
    if (t.some((v, j) => j > 0 && v <= t[j - 1]))
      return void errors.push(`Строка ${line} (${date}): времена идут не по порядку.`);
    if (days[date]) return void errors.push(`Строка ${line}: дата ${date} встречается дважды.`);
    days[date] = t.join(" ");
  });
  if (!errors.length && !Object.keys(days).length) errors.push("В таблице нет ни одной строки с временем намаза.");
  return { days, errors };
}
