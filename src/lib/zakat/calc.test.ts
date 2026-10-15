import { describe, expect, it } from "vitest";
import { calcZakat, type ZakatInput } from "./calc";

const base: ZakatInput = {
  cash: 0,
  bank: 0,
  goldGrams: 0,
  silverGrams: 0,
  trade: 0,
  receivable: 0,
  debts: 0,
  goldPrice: 0,
  silverPrice: 0,
};

describe("calcZakat", () => {
  it("без цены золота нисаб неизвестен — закят не считается", () => {
    expect(calcZakat({ ...base, cash: 1_000_000 }).reached).toBe(false);
  });
  it("ниже нисаба — ноль", () => {
    const r = calcZakat({ ...base, goldPrice: 1000, cash: 84_999 });
    expect(r.nisab).toBe(85_000);
    expect(r.due).toBe(0);
  });
  it("на нисабе — 2,5 %", () => {
    const r = calcZakat({ ...base, goldPrice: 1000, cash: 85_000 });
    expect(r.reached).toBe(true);
    expect(r.due).toBe(2125);
  });
  it("долги вычитаются, золото и серебро переводятся в рубли", () => {
    const r = calcZakat({ ...base, goldPrice: 1000, goldGrams: 100, bank: 20_000, debts: 10_000 });
    expect(r.net).toBe(110_000);
    expect(r.due).toBe(2750);
  });
  it("отрицательные и нечисловые значения игнорируются", () => {
    expect(calcZakat({ ...base, goldPrice: 1000, cash: -5, bank: NaN }).assets).toBe(0);
  });
});
