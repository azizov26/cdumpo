import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" ADD COLUMN "legacy_html" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_legacy_html" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" DROP COLUMN "legacy_html";
  ALTER TABLE "_news_v" DROP COLUMN "version_legacy_html";`)
}
