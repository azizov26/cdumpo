import type { CollectionConfig } from "payload";
import { publishedOrStaff, staffOnly } from "@/lib/cms/access";
import { dateField, slugField } from "@/lib/cms/fields";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/cms/revalidate";

export const Galleries: CollectionConfig = {
  slug: "galleries",
  labels: { singular: "Фотоальбом", plural: "Фотоальбомы" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "date", "_status"], group: "Жизнь уммы" },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  versions: { drafts: { autosave: false }, maxPerDoc: 10 },
  defaultSort: "-date",
  hooks: { afterChange: [revalidateAfterChange("galleries")], afterDelete: [revalidateAfterDelete("galleries")] },
  fields: [
    { name: "title", type: "text", label: "Название альбома", required: true },
    { name: "description", type: "textarea", label: "Описание" },
    {
      name: "photos",
      type: "array",
      label: "Фотографии",
      minRows: 1,
      labels: { singular: "Фото", plural: "Фото" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", label: "Фото", required: true },
        { name: "caption", type: "text", label: "Подпись" },
      ],
    },
    dateField("Дата события"),
    slugField(),
  ],
};
