import { describe, expect, it } from "vitest";
import { distanceToKaaba, PENZA, qiblaBearing, sideName, turnNeeded } from "./qibla";

describe("qibla", () => {
  it("из Пензы кибла — на юго-восток, около 3 700 км", () => {
    const b = qiblaBearing(PENZA);
    expect(b).toBeGreaterThan(150);
    expect(b).toBeLessThan(190);
    expect(distanceToKaaba(PENZA)).toBeGreaterThan(3500);
    expect(distanceToKaaba(PENZA)).toBeLessThan(4000);
  });
  it("из Лондона — юго-восток около 119°", () => {
    expect(qiblaBearing({ lat: 51.5, lon: -0.12 })).toBeCloseTo(119, 0);
  });
  it("названия сторон", () => {
    expect(sideName(0)).toBe("север");
    expect(sideName(359)).toBe("север");
    expect(sideName(135)).toBe("юго-восток");
  });
  it("поворот по кратчайшей дуге", () => {
    expect(turnNeeded(350, 10)).toBe(20);
    expect(turnNeeded(10, 350)).toBe(-20);
    expect(turnNeeded(0, 180)).toBe(-180);
  });
});
