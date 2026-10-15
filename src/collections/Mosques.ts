import type { CollectionConfig } from "payload";
import { publicRead, staffOnly } from "@/lib/cms/access";
import { revalidateAfterChange, revalidateAfterDelete } from "@/lib/cms/revalidate";

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const Mosques: CollectionConfig = {
  slug: "mosques",
  labels: { singular: "Мечеть", plural: "Мечети" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "locality", "imam", "phone"],
    group: "Мечети",
    description: "Мечети области для раздела «Мечети» и карты. Данные берём только у муфтията или имамов.",
  },
  access: { read: publicRead, create: staffOnly, update: staffOnly, delete: staffOnly },
  defaultSort: "name",
  hooks: { afterChange: [revalidateAfterChange("mosques")], afterDelete: [revalidateAfterDelete("mosques")] },
  fields: [
    { name: "name", type: "text", label: "Название", required: true },
    {
      name: "locality",
      type: "text",
      label: "Город или район",
      required: true,
      admin: { description: "Например: Пенза, Кузнецк, Нижнеломовский район." },
    },
    { name: "address", type: "text", label: "Адрес", required: true },
    {
      type: "row",
      fields: [
        {
          name: "lat",
          type: "number",
          label: "Широта",
          min: -90,
          max: 90,
          admin: {
            description: "Например 53.2007. Берётся из Яндекс Карт: правый клик по зданию → «Что здесь?».",
            step: 0.000001,
          },
        },
        { name: "lng", type: "number", label: "Долгота", min: -180, max: 180, admin: { step: 0.000001 } },
      ],
    },
    { name: "imam", type: "text", label: "Имам" },
    { name: "phone", type: "text", label: "Телефон" },
    {
      name: "jumaTime",
      type: "text",
      label: "Время джума",
      admin: { description: "В формате ЧЧ:ММ, например 13:00." },
      validate: (v: string | null | undefined) => (!v || HHMM.test(v) ? true : "Время нужно записать как 13:00."),
    },
    {
      name: "amenities",
      type: "select",
      hasMany: true,
      label: "Удобства",
      options: [
        { label: "Женский зал", value: "women" },
        { label: "Парковка", value: "parking" },
        { label: "Место для омовения", value: "ablution" },
        { label: "Доступно для маломобильных", value: "accessible" },
      ],
    },
    { name: "photo", type: "upload", relationTo: "media", label: "Фото" },
    { name: "notes", type: "textarea", label: "Примечание" },
  ],
};
