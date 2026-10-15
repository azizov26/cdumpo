import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/** После правки в админке сбрасываем кэш страниц сайта с этим тегом. */
const bust = (tag: string) => {
  try {
    // expire: 0 — следующий же запрос получает свежие данные: сотрудник публикует и сразу видит результат.
    revalidateTag(tag, { expire: 0 });
  } catch {
    // Вне запроса Next (скрипты, миграции) кэша нет — сбрасывать нечего.
  }
};

export const revalidateAfterChange =
  (...tags: string[]): CollectionAfterChangeHook =>
  ({ doc }) => {
    tags.forEach(bust);
    return doc;
  };

export const revalidateAfterDelete =
  (...tags: string[]): CollectionAfterDeleteHook =>
  ({ doc }) => {
    tags.forEach(bust);
    return doc;
  };

export const revalidateGlobal =
  (...tags: string[]): GlobalAfterChangeHook =>
  ({ doc }) => {
    tags.forEach(bust);
    return doc;
  };
