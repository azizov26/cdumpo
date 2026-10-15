import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_news_rubric" AS ENUM('Муфтият', 'Соборная мечеть', 'Видео', 'Фото');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_rubric" AS ENUM('Муфтият', 'Соборная мечеть', 'Видео', 'Фото');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_videos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__videos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_galleries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__galleries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_mosques_amenities" AS ENUM('women', 'parking', 'ablution', 'accessible');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"lead" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"rubric" "enum_news_rubric" DEFAULT 'Муфтият',
  	"date" timestamp(3) with time zone,
  	"slug" varchar,
  	"video_id" integer,
  	"gallery_id" integer,
  	"old_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_lead" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_rubric" "enum__news_v_version_rubric" DEFAULT 'Муфтият',
  	"version_date" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_video_id" integer,
  	"version_gallery_id" integer,
  	"version_old_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"preview_id" integer,
  	"description" varchar,
  	"date" timestamp(3) with time zone,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_videos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_videos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_url" varchar,
  	"version_preview_id" integer,
  	"version_description" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__videos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "galleries_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "galleries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"date" timestamp(3) with time zone,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_galleries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_galleries_v_version_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_galleries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__galleries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pages_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"lead" varchar,
  	"body" jsonb,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_version_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_lead" varchar,
  	"version_body" jsonb,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "mosques_amenities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_mosques_amenities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "mosques" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"locality" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"lat" numeric,
  	"lng" numeric,
  	"imam" varchar,
  	"phone" varchar,
  	"juma_time" varchar,
  	"photo_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_id" integer,
  	"videos_id" integer,
  	"galleries_id" integer,
  	"pages_id" integer,
  	"mosques_id" integer,
  	"media_id" integer,
  	"files_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prayer_times" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar DEFAULT 'Пенза',
  	"source" varchar,
  	"file_id" integer,
  	"days" jsonb,
  	"days_count" numeric,
  	"imported_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"hours" varchar,
  	"press_contact" varchar,
  	"telegram" varchar,
  	"vk" varchar,
  	"banner_enabled" boolean DEFAULT false,
  	"banner_text" varchar,
  	"banner_link" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "news" ADD CONSTRAINT "news_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_video_id_videos_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_gallery_id_galleries_id_fk" FOREIGN KEY ("version_gallery_id") REFERENCES "public"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_preview_id_media_id_fk" FOREIGN KEY ("preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_videos_v" ADD CONSTRAINT "_videos_v_parent_id_videos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_videos_v" ADD CONSTRAINT "_videos_v_version_preview_id_media_id_fk" FOREIGN KEY ("version_preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galleries_photos" ADD CONSTRAINT "galleries_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galleries_photos" ADD CONSTRAINT "galleries_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_galleries_v_version_photos" ADD CONSTRAINT "_galleries_v_version_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_galleries_v_version_photos" ADD CONSTRAINT "_galleries_v_version_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_galleries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_galleries_v" ADD CONSTRAINT "_galleries_v_parent_id_galleries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_attachments" ADD CONSTRAINT "pages_attachments_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_attachments" ADD CONSTRAINT "pages_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_attachments" ADD CONSTRAINT "_pages_v_version_attachments_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_attachments" ADD CONSTRAINT "_pages_v_version_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mosques_amenities" ADD CONSTRAINT "mosques_amenities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mosques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mosques" ADD CONSTRAINT "mosques_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_galleries_fk" FOREIGN KEY ("galleries_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mosques_fk" FOREIGN KEY ("mosques_id") REFERENCES "public"."mosques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prayer_times" ADD CONSTRAINT "prayer_times_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "news_cover_idx" ON "news" USING btree ("cover_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_video_idx" ON "news" USING btree ("video_id");
  CREATE INDEX "news_gallery_idx" ON "news" USING btree ("gallery_id");
  CREATE INDEX "news_old_url_idx" ON "news" USING btree ("old_url");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_cover_idx" ON "_news_v" USING btree ("version_cover_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_video_idx" ON "_news_v" USING btree ("version_video_id");
  CREATE INDEX "_news_v_version_version_gallery_idx" ON "_news_v" USING btree ("version_gallery_id");
  CREATE INDEX "_news_v_version_version_old_url_idx" ON "_news_v" USING btree ("version_old_url");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "videos_preview_idx" ON "videos" USING btree ("preview_id");
  CREATE UNIQUE INDEX "videos_slug_idx" ON "videos" USING btree ("slug");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE INDEX "videos__status_idx" ON "videos" USING btree ("_status");
  CREATE INDEX "_videos_v_parent_idx" ON "_videos_v" USING btree ("parent_id");
  CREATE INDEX "_videos_v_version_version_preview_idx" ON "_videos_v" USING btree ("version_preview_id");
  CREATE INDEX "_videos_v_version_version_slug_idx" ON "_videos_v" USING btree ("version_slug");
  CREATE INDEX "_videos_v_version_version_updated_at_idx" ON "_videos_v" USING btree ("version_updated_at");
  CREATE INDEX "_videos_v_version_version_created_at_idx" ON "_videos_v" USING btree ("version_created_at");
  CREATE INDEX "_videos_v_version_version__status_idx" ON "_videos_v" USING btree ("version__status");
  CREATE INDEX "_videos_v_created_at_idx" ON "_videos_v" USING btree ("created_at");
  CREATE INDEX "_videos_v_updated_at_idx" ON "_videos_v" USING btree ("updated_at");
  CREATE INDEX "_videos_v_latest_idx" ON "_videos_v" USING btree ("latest");
  CREATE INDEX "galleries_photos_order_idx" ON "galleries_photos" USING btree ("_order");
  CREATE INDEX "galleries_photos_parent_id_idx" ON "galleries_photos" USING btree ("_parent_id");
  CREATE INDEX "galleries_photos_image_idx" ON "galleries_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "galleries_slug_idx" ON "galleries" USING btree ("slug");
  CREATE INDEX "galleries_updated_at_idx" ON "galleries" USING btree ("updated_at");
  CREATE INDEX "galleries_created_at_idx" ON "galleries" USING btree ("created_at");
  CREATE INDEX "galleries__status_idx" ON "galleries" USING btree ("_status");
  CREATE INDEX "_galleries_v_version_photos_order_idx" ON "_galleries_v_version_photos" USING btree ("_order");
  CREATE INDEX "_galleries_v_version_photos_parent_id_idx" ON "_galleries_v_version_photos" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_version_photos_image_idx" ON "_galleries_v_version_photos" USING btree ("image_id");
  CREATE INDEX "_galleries_v_parent_idx" ON "_galleries_v" USING btree ("parent_id");
  CREATE INDEX "_galleries_v_version_version_slug_idx" ON "_galleries_v" USING btree ("version_slug");
  CREATE INDEX "_galleries_v_version_version_updated_at_idx" ON "_galleries_v" USING btree ("version_updated_at");
  CREATE INDEX "_galleries_v_version_version_created_at_idx" ON "_galleries_v" USING btree ("version_created_at");
  CREATE INDEX "_galleries_v_version_version__status_idx" ON "_galleries_v" USING btree ("version__status");
  CREATE INDEX "_galleries_v_created_at_idx" ON "_galleries_v" USING btree ("created_at");
  CREATE INDEX "_galleries_v_updated_at_idx" ON "_galleries_v" USING btree ("updated_at");
  CREATE INDEX "_galleries_v_latest_idx" ON "_galleries_v" USING btree ("latest");
  CREATE INDEX "pages_attachments_order_idx" ON "pages_attachments" USING btree ("_order");
  CREATE INDEX "pages_attachments_parent_id_idx" ON "pages_attachments" USING btree ("_parent_id");
  CREATE INDEX "pages_attachments_file_idx" ON "pages_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_version_attachments_order_idx" ON "_pages_v_version_attachments" USING btree ("_order");
  CREATE INDEX "_pages_v_version_attachments_parent_id_idx" ON "_pages_v_version_attachments" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_attachments_file_idx" ON "_pages_v_version_attachments" USING btree ("file_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "mosques_amenities_order_idx" ON "mosques_amenities" USING btree ("order");
  CREATE INDEX "mosques_amenities_parent_idx" ON "mosques_amenities" USING btree ("parent_id");
  CREATE INDEX "mosques_photo_idx" ON "mosques" USING btree ("photo_id");
  CREATE INDEX "mosques_updated_at_idx" ON "mosques" USING btree ("updated_at");
  CREATE INDEX "mosques_created_at_idx" ON "mosques" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "files_updated_at_idx" ON "files" USING btree ("updated_at");
  CREATE INDEX "files_created_at_idx" ON "files" USING btree ("created_at");
  CREATE UNIQUE INDEX "files_filename_idx" ON "files" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_galleries_id_idx" ON "payload_locked_documents_rels" USING btree ("galleries_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_mosques_id_idx" ON "payload_locked_documents_rels" USING btree ("mosques_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_files_id_idx" ON "payload_locked_documents_rels" USING btree ("files_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "prayer_times_file_idx" ON "prayer_times" USING btree ("file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "_videos_v" CASCADE;
  DROP TABLE "galleries_photos" CASCADE;
  DROP TABLE "galleries" CASCADE;
  DROP TABLE "_galleries_v_version_photos" CASCADE;
  DROP TABLE "_galleries_v" CASCADE;
  DROP TABLE "pages_attachments" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_version_attachments" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "mosques_amenities" CASCADE;
  DROP TABLE "mosques" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "files" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "prayer_times" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_news_rubric";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_rubric";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_videos_status";
  DROP TYPE "public"."enum__videos_v_version_status";
  DROP TYPE "public"."enum_galleries_status";
  DROP TYPE "public"."enum__galleries_v_version_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_mosques_amenities";
  DROP TYPE "public"."enum_users_role";`)
}
