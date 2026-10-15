import { describe, expect, it } from "vitest";
import { parseCsv, parsePrayerRows } from "./import";

const HEAD = "city,date,weekday,hijriDay,fajr,sunrise,dhuhr,asr,maghrib,isha";

describe("parseCsv", () => {
  it("читает запятую, точку с запятой и BOM", () => {
    expect(parseCsv("﻿a;b\r\n1;2\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
    expect(parseCsv('a,"b,c"\n1,2')).toEqual([
      ["a", "b,c"],
      ["1", "2"],
    ]);
  });
});

describe("parsePrayerRows", () => {
  it("собирает таблицу в формате сайта", () => {
    const rows = parseCsv(
      `${HEAD}\nПенза,2026-01-01,чт,0,06:26,08:14,12:15,13:38,15:54,17:42\nКазань,2026-01-01,чт,0,06:00,08:00,12:00,13:00,15:00,17:00`,
    );
    const { days, errors } = parsePrayerRows(rows);
    expect(errors).toEqual([]);
    expect(days).toEqual({ "2026-01-01": "06:26 08:14 12:15 13:38 15:54 17:42" });
  });
  it("принимает даты ДД.ММ.ГГГГ и время Excel (доля суток)", () => {
    const { days, errors } = parsePrayerRows([
      ["Дата", "Фаджр", "Восход", "Зухр", "Аср", "Магриб", "Иша"],
      ["15.10.2026", 0.2, "6:26", "12:15", "14:28", "17:04", "18:39"],
    ]);
    expect(errors).toEqual([]);
    expect(days["2026-10-15"]).toBe("04:48 06:26 12:15 14:28 17:04 18:39");
  });
  it("сообщает о нечитаемом времени и неверном порядке", () => {
    const { errors } = parsePrayerRows(
      parseCsv(
        `${HEAD}\nПенза,2026-01-01,чт,0,06:26,08:14,12:15,13:38,15:54,xx\nПенза,2026-01-02,чт,0,09:00,08:14,12:15,13:38,15:54,17:42`,
      ),
    );
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain("Строка 2");
    expect(errors[1]).toContain("не по порядку");
  });
  it("просит недостающие столбцы", () => {
    expect(parsePrayerRows([["date", "fajr"]]).errors[0]).toContain("не хватает столбцов");
  });
});
