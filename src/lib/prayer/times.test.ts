import { describe, expect, it } from "vitest";
import { dateKey, formatTime, getDayTimes, getNext, getSkyState, hasTable } from "./times";

// Москва = UTC+3: 12:00 по Москве — 09:00 UTC.
const msk = (iso: string) => new Date(`${iso}+03:00`);

describe("время намаза из таблицы", () => {
  it("берёт строку таблицы на московскую дату", () => {
    const t = getDayTimes(msk("2026-10-15T12:00:00"));
    expect(["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"].map((k) => formatTime(t[k as keyof typeof t]))).toEqual([
      "04:54", "06:26", "12:15", "14:28", "17:04", "18:39",
    ]);
  });

  it("определяет дату по Москве, а не по UTC", () => {
    // 00:30 по Москве 16 октября — в UTC ещё 15-е.
    expect(dateKey(msk("2026-10-16T00:30:00"))).toBe("2026-10-16");
  });

  it("вне таблицы — расчёт", () => {
    const d = msk("2027-03-01T12:00:00");
    expect(hasTable(d)).toBe(false);
    const t = getDayTimes(d);
    expect(t.fajr < t.sunrise && t.sunrise < t.dhuhr && t.dhuhr < t.asr && t.asr < t.maghrib && t.maghrib < t.isha).toBe(true);
  });
});

describe("ближайший намаз и небо", () => {
  const day = msk("2026-10-15T12:00:00");
  const t = getDayTimes(day);

  it("после иши следующий — фаджр завтрашнего дня", () => {
    const n = getNext(msk("2026-10-15T22:00:00"), t);
    expect(n.key).toBe("fajr");
    expect(dateKey(n.at)).toBe("2026-10-16");
  });

  it("восход не считается намазом", () => {
    expect(getNext(msk("2026-10-15T05:30:00"), t).key).toBe("dhuhr");
  });

  it("состояния неба по границам пакета дизайнера", () => {
    expect(getSkyState(msk("2026-10-15T03:00:00"), t)).toBe("night");
    expect(getSkyState(msk("2026-10-15T05:30:00"), t)).toBe("dawn");
    expect(getSkyState(msk("2026-10-15T13:00:00"), t)).toBe("day");
    expect(getSkyState(msk("2026-10-15T15:00:00"), t)).toBe("asr");
    expect(getSkyState(msk("2026-10-15T16:30:00"), t)).toBe("evening");
    expect(getSkyState(msk("2026-10-15T19:00:00"), t)).toBe("night");
  });
});

import { upcomingDates } from "@/lib/hijri";

describe("ближайшие даты", () => {
  it("первая — джума, дальше памятные даты по порядку", () => {
    const list = upcomingDates(msk("2026-10-15T12:00:00"));
    expect(list[0].title).toBe("Джума-намаз");
    expect(dateKey(list[0].date)).toBe("2026-10-16");
    expect(list.map((x) => x.title).slice(1)).toEqual(["Начало месяца раджаб", "Ночь Мирадж", "Ночь Бараат"]);
    expect(dateKey(list[1].date)).toBe("2026-12-10");
  });
});

describe("ближайшие даты после полуночи", () => {
  it("в 01:00 по Москве в пятницу джума — сегодня", () => {
    expect(dateKey(upcomingDates(msk("2026-10-16T01:00:00"))[0].date)).toBe("2026-10-16");
  });
});
