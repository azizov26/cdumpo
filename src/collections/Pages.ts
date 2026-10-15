import type { CollectionConfig } from "payload";
import { publishedOrStaff, staffOnly } from "@/lib/cms/access";
import { slugField } from "@/lib/cms/fields";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/cms/revalidate";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Страница", plural: "Страницы" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status"],
    group: "Материалы",
    description: "Текстовые страницы раздела «Муфтият»: история, структура, документы.",
  },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  versions: { drafts: { autosave: false }, maxPerDoc: 10 },
  hooks: { afterChange: [revalidateAfterChange("pages")], afterDelete: [revalidateAfterDelete("pages")] },
  fields: [
    { name: "title", type: "text", label: "Заголовок", required: true },
    { name: "lead", type: "textarea", label: "Вступление" },
    { name: "body", type: "richText", label: "Текст страницы" },
    {
      name: "attachments",
      type: "array",
      label: "Прикреплённые документы",
      labels: { singular: "Документ", plural: "Документы" },
      fields: [
        { name: "title", type: "text", label: "Название", required: true },
        { name: "file", type: "upload", relationTo: "files", label: "Файл", required: true },
      ],
    },
    slugField(),
  ],
};
