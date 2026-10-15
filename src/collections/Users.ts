import type { CollectionConfig } from "payload";
import { adminOnly, adminOnlyField, isAdmin } from "@/lib/cms/access";
import { staffAuth } from "@/lib/cms/security";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Сотрудник", plural: "Сотрудники" },
  auth: staffAuth,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    group: "Настройки",
    description: "Кто может входить в админку. Видно только администраторам.",
    hidden: ({ user }) => !isAdmin(user),
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    // Редактор может открыть и поменять только себя (например, пароль), но не список.
    read: ({ req }) => (isAdmin(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) => (isAdmin(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Самый первый пользователь — всегда администратор: иначе в админку было бы не войти.
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
          if (totalDocs === 0) data.role = "admin";
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Имя",
      admin: { description: "Как подписывать в админке, например «Айдар»." },
    },
    {
      name: "role",
      type: "select",
      label: "Роль",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      options: [
        { label: "Администратор — всё, включая настройки и сотрудников", value: "admin" },
        { label: "Редактор — новости, видео, фото, мечети, расписание", value: "editor" },
      ],
      access: { create: adminOnlyField, update: adminOnlyField },
    },
  ],
};
