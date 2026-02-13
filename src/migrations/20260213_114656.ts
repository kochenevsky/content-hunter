import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "footer_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link" varchar NOT NULL
  );
  
  CREATE TABLE "footer_materials_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "home_page" ADD COLUMN "hero_primary_button_link" varchar;
  ALTER TABLE "home_page" ADD COLUMN "hero_secondary_button_link" varchar;
  ALTER TABLE "home_page" ADD COLUMN "cta_primary_button_link" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_primary_button_text" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "hero_secondary_button_text" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "cta_secondary_button_text" varchar;
  ALTER TABLE "services_page" ADD COLUMN "hero_primary_button_link" varchar;
  ALTER TABLE "services_page" ADD COLUMN "hero_secondary_button_link" varchar;
  ALTER TABLE "services_page" ADD COLUMN "cta_primary_button_link" varchar;
  ALTER TABLE "services_page" ADD COLUMN "cta_secondary_button_link" varchar;
  ALTER TABLE "footer_materials" ADD CONSTRAINT "footer_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_materials_locales" ADD CONSTRAINT "footer_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_materials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_materials_order_idx" ON "footer_materials" USING btree ("_order");
  CREATE INDEX "footer_materials_parent_id_idx" ON "footer_materials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_materials_locales_locale_parent_id_unique" ON "footer_materials_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "footer_materials" CASCADE;
  DROP TABLE "footer_materials_locales" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "hero_primary_button_link";
  ALTER TABLE "home_page" DROP COLUMN "hero_secondary_button_link";
  ALTER TABLE "home_page" DROP COLUMN "cta_primary_button_link";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_primary_button_text";
  ALTER TABLE "home_page_locales" DROP COLUMN "hero_secondary_button_text";
  ALTER TABLE "home_page_locales" DROP COLUMN "cta_secondary_button_text";
  ALTER TABLE "services_page" DROP COLUMN "hero_primary_button_link";
  ALTER TABLE "services_page" DROP COLUMN "hero_secondary_button_link";
  ALTER TABLE "services_page" DROP COLUMN "cta_primary_button_link";
  ALTER TABLE "services_page" DROP COLUMN "cta_secondary_button_link";`)
}
