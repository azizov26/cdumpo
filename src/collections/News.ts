import type { CollectionConfig } from "payload";
import { RUBRICS } from "@/lib/content/rubrics";
import { publishedOrStaff, staffOnly } from "@/lib/cms/access";
import { dateField, slugField } from "@/lib/cms/fields";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/cms/revalidate";

export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "Новость", plural: "Новости" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "rubric", "date", "_status"],
    group: "Жизнь уммы",
    description: "Новости для раздела «Жизнь уммы». Пока запись в черновиках, на сайте её не видно.",
  },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },
  defaultSort: "-date",
  hooks: { afterChange: [revalidateAfterChange("news")], afterDelete: [revalidateAfterDelete("news")] },
  fields: [
    { name: "title", type: "text", label: "Заголовок", required: true },
    {
      name: "lead",
      type: "textarea",
      label: "Лид",
      admin: { description: "Одно-два предложения под заголовком; показывается в ленте и при отправке ссылки." },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Обложка",
      admin: { description: "Если фото нет, на сайте будет фирменная заставка с небом." },
    },
    { name: "body", type: "richText", label: "Текст новости" },
    {
      name: "rubric",
      type: "select",
      label: "Рубрика",
      required: true,
      defaultValue: "Муфтият",
      options: RUBRICS.map((r) => ({ label: r, value: r })),
      admin: { position: "sidebar" },
    },
    dateField(),
    slugField(),
    {
      name: "video",
      type: "relationship",
      relationTo: "videos",
      label: "Связанное видео",
      admin: { position: "sidebar" },
    },
    {
      name: "gallery",
      type: "relationship",
      relationTo: "galleries",
      label: "Фотоальбом",
      admin: { position: "sidebar" },
    },
    {
      name: "oldUrl",
      type: "text",
      label: "Старый адрес (для переадресации)",
      index: true,
      admin: {
        position: "sidebar",
        description:
          "Заполняется только у новостей со старого сайта, например /cdumpo/article?id=… Новым новостям не нужно.",
      },
    },
  ],
};
