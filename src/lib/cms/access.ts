import type { Access, FieldAccess } from "payload";

const roleOf = (user: object | null | undefined) => (user as { role?: string } | null | undefined)?.role;

export const isAdmin = (user: object | null | undefined) => roleOf(user) === "admin";
export const isStaff = (user: object | null | undefined) => roleOf(user) === "admin" || roleOf(user) === "editor";

export const adminOnly: Access = ({ req }) => isAdmin(req.user);
export const staffOnly: Access = ({ req }) => isStaff(req.user);
export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user);

/** Публично читаются только опубликованные записи; сотрудники видят и черновики. */
export const publishedOrStaff: Access = ({ req }) => (isStaff(req.user) ? true : { _status: { equals: "published" } });
export const publicRead: Access = () => true;
