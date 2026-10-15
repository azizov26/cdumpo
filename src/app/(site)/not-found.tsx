import type { Metadata } from "next";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

export const metadata: Metadata = { title: "Страница не найдена", robots: { index: false } };

// notFound() внутри сайта (например, несуществующая новость). Неизвестные адреса — app/global-not-found.tsx.
export default function NotFound() {
  return <NotFoundContent />;
}
