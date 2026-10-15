import sanitizeHtml from "sanitize-html";

// HTML перенесённых со старого сайта новостей (data/legacy/news.json) перед показом или импортом в админку.
// Белый список: текст, ссылки, картинки, видео-файлы и плееры YouTube/Rutube/VK. Скриптов, style, class, on*,
// svg, object и чужих iframe не остаётся (PRODUCT.md → «Защита»).

/** Плееры, которые разрешены в iframe (совпадает с frame-src в next.config.ts). YouTube переписываем на домен без cookie. */
const PLAYERS = ["rutube.ru", "vk.com", "vkvideo.ru", "www.youtube-nocookie.com"];

function playerUrl(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw.startsWith("//") ? `https:${raw}` : raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  if (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") u.hostname = "www.youtube-nocookie.com";
  if (!PLAYERS.includes(u.hostname)) return null;
  u.protocol = "https:";
  return u.toString();
}

export function sanitizeLegacyHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "blockquote",
      "h2",
      "h3",
      "h4",
      "a",
      "figure",
      "figcaption",
      "img",
      "video",
      "iframe",
    ],
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt", "width", "height", "loading"],
      video: ["src", "controls", "width", "height", "poster", "preload"],
      iframe: ["src", "width", "height", "title", "allowfullscreen", "loading", "referrerpolicy"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"], video: ["http", "https"] },
    allowProtocolRelative: false,
    // Содержимое этих тегов выбрасываем вместе с тегом (не оставляем текст скриптов).
    nonTextTags: ["script", "style", "textarea", "option", "noscript", "svg", "object", "embed"],
    transformTags: {
      a: (tag, attribs) => ({
        tagName: tag,
        attribs:
          attribs.href && /^https?:/i.test(attribs.href)
            ? { href: attribs.href, rel: "noopener noreferrer", target: "_blank" }
            : attribs,
      }),
      video: (tag, attribs) => ({ tagName: tag, attribs: { ...attribs, controls: "", preload: "none" } }),
      iframe: (tag, attribs) => {
        const src = attribs.src ? playerUrl(attribs.src) : null;
        // Чужой плеер — пустой iframe без src, ниже exclusiveFilter его уберёт.
        return {
          tagName: tag,
          attribs: src ? { ...attribs, src, loading: "lazy", referrerpolicy: "strict-origin-when-cross-origin" } : {},
        };
      },
    },
    exclusiveFilter: (f) => f.tag === "iframe" && !f.attribs.src,
  });
}
