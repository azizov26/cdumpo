import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("транслитерирует русский заголовок", () => {
    expect(slugify("Региональный конкурс «Моя мечеть»")).toBe("regionalnyy-konkurs-moya-mechet");
  });
  it("сохраняет цифры и схлопывает знаки", () => {
    expect(slugify("Ураза-байрам — 2026!")).toBe("uraza-bayram-2026");
  });
  it("обрезает длинное и не оставляет дефис на конце", () => {
    const s = slugify("слово ".repeat(40), 20);
    expect(s.length).toBeLessThanOrEqual(20);
    expect(s.endsWith("-")).toBe(false);
  });
  it("пустая строка остаётся пустой", () => {
    expect(slugify("  ")).toBe("");
  });
});
