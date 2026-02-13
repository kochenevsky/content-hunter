import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_video_examples_items_vimeo_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  ALTER TABLE "home_page_video_examples_items_vimeo_ids" ADD CONSTRAINT "home_page_video_examples_items_vimeo_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_video_examples_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_video_examples_items_vimeo_ids_order_idx" ON "home_page_video_examples_items_vimeo_ids" USING btree ("_order");
  CREATE INDEX "home_page_video_examples_items_vimeo_ids_parent_id_idx" ON "home_page_video_examples_items_vimeo_ids" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_video_examples_items_vimeo_ids" CASCADE;`)
}
