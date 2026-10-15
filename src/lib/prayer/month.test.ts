import { describe, expect, it } from "vitest";
import { getMonthRows, getYearDaylight, monthOf, weekStartIndex } from "./month";
import { formatTime } from "./times";

describe("расписание на месяц", () => {
  const oct = getMonthRows(2026, 9);

  it("все дни месяца, по порядку, из таблицы", () => {
    expect(oct).toHaveLength(31);
    expect(oct[0].key).toBe("2026-10-01");
    expect(oct[30].key).toBe("2026-10-31");
    expect(oct.every((r) => r.fromTable)).toBe(true);
    expect(formatTime(oct[14].times.maghrib)).toBe("17:04");
  });

  it("дни недели и пятницы", () => {
    expect(oct[0].weekday).toBe("чт"); // 1 октября 2026 — четверг
    expect(oct[1].friday).toBe(true);
    expect(oct.filter((r) => r.friday)).toHaveLength(5);
  });

  it("февраль 2026 — 28 дней", () => {
    expect(getMonthRows(2026, 1)).toHaveLength(28);
  });

  it("отмечает начало месяца хиджры, по одному на месяц", () => {
    const starts = oct.filter((r) => r.hijriStart);
    expect(starts.length).toBeGreaterThanOrEqual(1);
    expect(starts.every((r) => r.hijriStart!.startsWith("1 "))).toBe(true);
  });

  it("неделя для свёрнутого вида начинается с понедельника", () => {
    const i = weekStartIndex(oct, 15); // чт 15 октября → пн 12 октября
    expect(oct[i].day).toBe(12);
    expect(weekStartIndex(oct, 2)).toBe(0); // первая неделя неполная — с 1-го числа
  });

  it("месяц по Москве", () => {
    expect(monthOf(new Date("2026-10-31T22:30:00Z"))).toEqual({ year: 2026, month: 10 });
  });
});

describe("просвет дня по месяцам", () => {
  const y = getYearDaylight(2026);
  it("летом день длиннее, чем зимой, порядок сумерек верный", () => {
    expect(y).toHaveLength(12);
    const len = (m: number) => y[m].maghrib - y[m].sunrise;
    expect(len(5)).toBeGreaterThan(len(11));
    expect(y.every((d) => d.fajr < d.sunrise && d.sunrise < d.maghrib && d.maghrib < d.isha)).toBe(true);
  });
});
