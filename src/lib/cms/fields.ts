import type { Field, FieldHook } from "payload";
import { slugify } from "@/lib/slug";

/** Адрес страницы: если поле пустое — собирается из заголовка латиницей. Можно поправить вручную. */
const fillSlug: FieldHook = ({ value, data, operation, originalDoc }) => {
  // Уже готовый адрес (например, из переноса со старого сайта) не укорачиваем: на него ведут редиректы.
  if (typeof value === "string" && value.trim()) return slugify(value, 200);
  const title = (data?.title ?? originalDoc?.title) as string | undefined;
  if (operation === "create" || !originalDoc?.slug) return title ? slugify(title) : value;
  return originalDoc.slug;
};

export const slugField = (): Field => ({
  name: "slug",
  type: "text",
  label: "Адрес страницы",
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: "Появится в ссылке. Заполняется само по заголовку, менять не нужно. После публикации лучше не менять.",
  },
  hooks: { beforeValidate: [fillSlug] },
});

export const dateField = (label = "Дата публикации"): Field => ({
  name: "date",
  type: "date",
  label,
  required: true,
  defaultValue: () => new Date().toISOString(),
  admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime", displayFormat: "d MMMM yyyy, HH:mm" } },
});
