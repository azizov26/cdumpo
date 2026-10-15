import { readFile } from "node:fs/promises";
import path from "node:path";
import type { GlobalConfig } from "payload";
import { APIError } from "payload";
import { publicRead, staffOnly } from "@/lib/cms/access";
import { revalidateGlobal } from "@/lib/cms/revalidate";
import { type Cell, parseCsv, parsePrayerRows } from "@/lib/prayer/import";

async function readSheetRows(filePath: string, filename: string): Promise<Cell[][]> {
  const buf = await readFile(filePath);
  if (/\.xlsx$/i.test(filename)) {
    const { readSheet } = await import("read-excel-file/node");
    return (await readSheet(buf)) as Cell[][];
  }
  if (/\.csv$/i.test(filename)) return parseCsv(buf.toString("utf8"));
  throw new APIError("Нужен файл CSV или Excel (.xlsx). Старый формат .xls сохраните как .xlsx.", 400);
}

export const PrayerTimes: GlobalConfig = {
  slug: "prayer-times",
  label: "Расписание намазов",
  admin: {
    group: "Мечети",
    description:
      "Загрузите таблицу на год (CSV или Excel). Таблица проверяется при сохранении; если в ней ошибка, вы увидите, в какой строке.",
  },
  access: { read: publicRead, update: staffOnly },
  hooks: { afterChange: [revalidateGlobal("prayer-times")] },
  fields: [
    {
      name: "city",
      type: "text",
      label: "Город",
      defaultValue: "Пенза",
      admin: { readOnly: true, description: "Пока только Пенза." },
    },
    {
      name: "source",
      type: "text",
      label: "Откуда расписание",
      admin: { description: "Например: «Расписание муфтията на 2026 год». Видно только вам." },
    },
    {
      name: "file",
      type: "upload",
      relationTo: "files",
      label: "Файл с расписанием",
      admin: {
        description:
          "Первая строка — названия столбцов: date, fajr, sunrise, dhuhr, asr, maghrib, isha (можно по-русски: Дата, Фаджр, Восход, Зухр, Аср, Магриб, Иша). Время — 05:30. Дата — 2026-10-15 или 15.10.2026.",
      },
    },
    {
      name: "days",
      type: "json",
      label: "Загруженная таблица",
      // Сырые данные сотруднику не нужны: видно число дней и время загрузки.
      admin: { hidden: true },
    },
    { name: "daysCount", type: "number", label: "Дней в таблице", admin: { readOnly: true } },
    {
      name: "importedAt",
      type: "date",
      label: "Загружено",
      admin: { readOnly: true, date: { displayFormat: "d MMMM yyyy, HH:mm" } },
    },
  ],
};

// Разбор файла при сохранении. Читаем с диска (media/files); при переходе на S3 заменить на запрос по URL.
PrayerTimes.hooks = {
  ...PrayerTimes.hooks,
  beforeChange: [
    async ({ data, originalDoc, req }) => {
      const fileId = typeof data.file === "object" && data.file ? data.file.id : data.file;
      const prevId =
        typeof originalDoc?.file === "object" && originalDoc.file ? originalDoc.file.id : originalDoc?.file;
      if (!fileId) return data;
      if (fileId === prevId && data.days) return data;
      const file = await req.payload.findByID({ collection: "files", id: fileId, overrideAccess: true });
      const filename = file.filename as string;
      let rows: Cell[][];
      try {
        rows = await readSheetRows(path.resolve(process.cwd(), "media/files", filename), filename);
      } catch (e) {
        if (e instanceof APIError) throw e;
        throw new APIError("Не удалось открыть файл. Проверьте, что это настоящий CSV или .xlsx.", 400);
      }
      const { days, errors } = parsePrayerRows(rows);
      if (errors.length) {
        const shown = errors.slice(0, 5).join(" ");
        throw new APIError(
          `Таблица не принята. ${shown}${errors.length > 5 ? ` …и ещё ошибок: ${errors.length - 5}.` : ""}`,
          400,
        );
      }
      data.days = days;
      data.daysCount = Object.keys(days).length;
      data.importedAt = new Date().toISOString();
      return data;
    },
  ],
};
