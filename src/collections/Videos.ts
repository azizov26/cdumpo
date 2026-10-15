import type { CollectionConfig } from "payload";
import { publishedOrStaff, staffOnly } from "@/lib/cms/access";
import { dateField, slugField } from "@/lib/cms/fields";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/cms/revalidate";

const ALLOWED_HOSTS = ["vk.com", "vkvideo.ru", "vk.ru", "rutube.ru"];

export const Videos: CollectionConfig = {
  slug: "videos",
  labels: { singular: "Видео", plural: "Видео" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "_status"],
    group: "Жизнь уммы",
    description: "Видео не хранится на сайте: вставляется ссылка на VK Видео или RuTube.",
  },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  versions: { drafts: { autosave: false }, maxPerDoc: 10 },
  defaultSort: "-date",
  hooks: { afterChange: [revalidateAfterChange("videos")], afterDelete: [revalidateAfterDelete("videos")] },
  fields: [
    { name: "title", type: "text", label: "Название", required: true },
    {
      name: "url",
      type: "text",
      label: "Ссылка на видео",
      required: true,
      admin: { description: "Адрес страницы видео на VK Видео или RuTube." },
      validate: (value: string | null | undefined) => {
        if (!value) return "Вставьте ссылку на видео.";
        try {
          const host = new URL(value).hostname.replace(/^www\./, "");
          if (!ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)))
            return "Ссылка должна вести на VK Видео или RuTube.";
        } catch {
          return "Это не похоже на ссылку. Скопируйте адрес целиком, вместе с https://.";
        }
        return true;
      },
    },
    {
      name: "preview",
      type: "upload",
      relationTo: "media",
      label: "Картинка-превью",
      required: true,
      admin: { description: "Обязательна: по ней человек узнаёт видео в ленте." },
    },
    { name: "description", type: "textarea", label: "Описание" },
    dateField("Дата видео"),
    slugField(),
  ],
};
