import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { ru } from "@payloadcms/translations/languages/ru";
import { Files } from "./collections/Files";
import { Galleries } from "./collections/Galleries";
import { Media } from "./collections/Media";
import { Mosques } from "./collections/Mosques";
import { News } from "./collections/News";
import { Pages } from "./collections/Pages";
import { Users } from "./collections/Users";
import { Videos } from "./collections/Videos";
import { PrayerTimes } from "./globals/PrayerTimes";
import { SiteSettings } from "./globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — ЦДУМ ПО", description: "Админка сайта ЦДУМ ПО" },
  },
  collections: [News, Videos, Galleries, Pages, Mosques, Media, Files, Users],
  globals: [PrayerTimes, SiteSettings],
  editor: lexicalEditor(),
  sharp,
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    // В разработке схема подтягивается сама. На проде — только миграции, отдельным шагом деплоя
    // (`pnpm migrate` перед `pnpm start`): внутри приложения они бы спрашивали подтверждение и вешали сборку.
    push: process.env.NODE_ENV !== "production",
  }),
  i18n: { supportedLanguages: { ru }, fallbackLanguage: "ru" },
});
