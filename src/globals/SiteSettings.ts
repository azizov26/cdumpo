import type { GlobalConfig } from "payload";
import { adminOnly, isAdmin, publicRead } from "@/lib/cms/access";
import { revalidateGlobal } from "@/lib/cms/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Настройки сайта",
  admin: {
    group: "Настройки",
    hidden: ({ user }) => !isAdmin(user),
    description: "Контакты муфтията, соцсети и баннер. Видно только администраторам.",
  },
  access: { read: publicRead, update: adminOnly },
  hooks: { afterChange: [revalidateGlobal("site-settings")] },
  fields: [
    {
      type: "collapsible",
      label: "Контакты",
      admin: { initCollapsed: false },
      fields: [
        {
          name: "phone",
          type: "text",
          label: "Телефон приёмной",
          admin: { description: "Как показывать на сайте, например +7 (8412) 00-00-00." },
        },
        { name: "email", type: "email", label: "Электронная почта" },
        { name: "hours", type: "text", label: "Часы приёма", admin: { description: "Например: пн–пт, 9:00–18:00." } },
        {
          name: "pressContact",
          type: "text",
          label: "Контакт для журналистов",
          admin: { description: "Имя и телефон или почта." },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Соцсети",
      fields: [
        {
          name: "telegram",
          type: "text",
          label: "Telegram",
          admin: { description: "Ссылка на канал, https://t.me/…" },
        },
        { name: "vk", type: "text", label: "ВКонтакте", admin: { description: "Ссылка на сообщество." } },
      ],
    },
    {
      type: "collapsible",
      label: "Баннер-объявление",
      admin: { description: "Короткое сообщение над шапкой сайта, например о переносе времени джума." },
      fields: [
        { name: "bannerEnabled", type: "checkbox", label: "Показывать баннер", defaultValue: false },
        { name: "bannerText", type: "text", label: "Текст", admin: { condition: (d) => d?.bannerEnabled } },
        {
          name: "bannerLink",
          type: "text",
          label: "Ссылка (необязательно)",
          admin: { condition: (d) => d?.bannerEnabled },
        },
      ],
    },
  ],
};
