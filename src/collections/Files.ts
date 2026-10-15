import type { CollectionConfig } from "payload";
import { publicRead, staffOnly } from "@/lib/cms/access";

export const Files: CollectionConfig = {
  slug: "files",
  labels: { singular: "Файл", plural: "Файлы" },
  admin: { useAsTitle: "title", group: "Материалы", description: "Документы и таблицы: PDF, CSV, Excel." },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  upload: {
    staticDir: "media/files",
    mimeTypes: [
      "application/pdf",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
  fields: [{ name: "title", type: "text", label: "Название", required: true }],
};
