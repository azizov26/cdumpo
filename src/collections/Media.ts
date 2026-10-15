import type { CollectionConfig } from "payload";
import { publicRead, staffOnly } from "@/lib/cms/access";

// Пока файлы лежат на диске сервера (папка media/); при переезде — S3 через @payloadcms/storage-s3.
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Изображение", plural: "Изображения" },
  admin: {
    useAsTitle: "alt",
    group: "Материалы",
    description: "Фотографии и обложки. Реальные фото только от муфтията.",
  },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    imageSizes: [
      { name: "card", width: 640, formatOptions: { format: "webp", options: { quality: 80 } } },
      { name: "wide", width: 1280, formatOptions: { format: "webp", options: { quality: 80 } } },
    ],
    adminThumbnail: "card",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Описание фото",
      required: true,
      admin: {
        description:
          "Что на фото, одной фразой — для слабовидящих и поисковиков. Например: «Строительная площадка Соборной мечети».",
      },
    },
    { name: "credit", type: "text", label: "Автор фото", admin: { description: "Необязательно." } },
  ],
};
