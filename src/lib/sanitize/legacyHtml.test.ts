import { describe, expect, it } from "vitest";
import { sanitizeLegacyHtml as clean } from "./legacyHtml";
import legacy from "../../../data/legacy/news.json";

describe("sanitizeLegacyHtml", () => {
  it("убирает скрипты вместе с содержимым", () => {
    expect(clean("<p>a</p><script>alert(1)</script>")).toBe("<p>a</p>");
    expect(clean('<script async src="//www.instagram.com/embed.js"></script>')).toBe("");
  });
  it("убирает обработчики, style и class", () => {
    expect(clean('<p onclick="x()" style="color:red" class="c">t</p>')).toBe("<p>t</p>");
    expect(clean('<img src="https://a/b.png" onerror="x()" srcset="a 1w" class="c">')).toBe(
      '<img src="https://a/b.png" />',
    );
  });
  it("запрещает javascript: и data: в ссылках и картинках", () => {
    expect(clean('<a href="javascript:alert(1)">x</a>')).toBe("<a>x</a>");
    expect(clean('<img src="data:text/html;base64,AAA">')).toBe("<img />");
  });
  it("внешние ссылки открываются безопасно", () => {
    expect(clean('<a href="https://example.ru">x</a>')).toBe(
      '<a href="https://example.ru" rel="noopener noreferrer" target="_blank">x</a>',
    );
  });
  it("YouTube-плеер переписывается на youtube-nocookie, чужой iframe удаляется", () => {
    expect(clean('<iframe src="https://www.youtube.com/embed/abc"></iframe>')).toContain(
      "https://www.youtube-nocookie.com/embed/abc",
    );
    expect(clean('<iframe src="https://evil.example/x"></iframe>')).toBe("");
    expect(clean('<iframe src="javascript:alert(1)"></iframe>')).toBe("");
  });
  it("убирает svg, object, div-обёртки оставляют текст", () => {
    expect(clean('<svg><path d="M0"/></svg><object data="x"></object><div>текст</div>')).toBe("текст");
  });
  it("на всех 427 перенесённых новостях не остаётся опасного", () => {
    const items = legacy as { html: string }[];
    for (const n of items) {
      const out = clean(n.html);
      expect(out).not.toMatch(/<script|<object|<svg|\son[a-z]+=|javascript:|\sstyle=|\sclass=/i);
      for (const m of out.matchAll(/<iframe[^>]*src="([^"]+)"/g))
        expect(m[1]).toMatch(/^https:\/\/(rutube\.ru|vk\.com|vkvideo\.ru|www\.youtube-nocookie\.com)\//);
    }
  });
});
