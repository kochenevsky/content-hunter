import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_cases_social_links_platform" AS ENUM('instagram', 'tiktok', 'youtube', 'vk');
  CREATE TYPE "public"."enum_cases_niche" AS ENUM('ecommerce', 'edu', 'expert', 'horeca', 'beauty', 'travel', 'realestate', 'digital', 'other');
  CREATE TYPE "public"."enum_cases_currency" AS ENUM('RUB', 'USD', 'EUR');
  CREATE TYPE "public"."enum_blog_posts_category" AS ENUM('cases', 'analysis', 'process', 'myths', 'news', 'guides');
  CREATE TYPE "public"."enum_pricing_currency" AS ENUM('RUB', 'USD');
  CREATE TYPE "public"."enum_faq_category" AS ENUM('general', 'services', 'pricing', 'process', 'results', 'technical', 'niches');
  CREATE TYPE "public"."enum_footer_social_platform" AS ENUM('telegram', 'instagram', 'youtube', 'tiktok', 'whatsapp');
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
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
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
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"headline" varchar,
  	"text" varchar,
  	"button_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_features_features_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_locales" (
  	"headline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"hero_image_id" integer,
  	"hero_cta_primary_link" varchar,
  	"hero_cta_secondary_link" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"hero_headline" varchar,
  	"hero_subheadline" varchar,
  	"hero_cta_primary_text" varchar,
  	"hero_cta_secondary_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cases_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_cases_social_links_platform",
  	"url" varchar
  );
  
  CREATE TABLE "cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"niche" "enum_cases_niche" NOT NULL,
  	"image_id" integer,
  	"publications" numeric NOT NULL,
  	"views" numeric NOT NULL,
  	"revenue" numeric NOT NULL,
  	"currency" "enum_cases_currency" DEFAULT 'RUB',
  	"ctr" numeric,
  	"conversion" numeric,
  	"duration" varchar,
  	"published" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cases_locales" (
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_blog_posts_category" NOT NULL,
  	"image_id" integer,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_posts_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pricing_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"included" boolean DEFAULT true
  );
  
  CREATE TABLE "pricing_features_locales" (
  	"feature" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pricing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL,
  	"currency" "enum_pricing_currency" DEFAULT 'RUB',
  	"period" varchar DEFAULT 'месяц',
  	"is_popular" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pricing_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"cta_text" varchar DEFAULT 'Выбрать',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_faq_category" DEFAULT 'general',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"telegram" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_locales" (
  	"role" varchar NOT NULL,
  	"bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"cases_id" integer,
  	"blog_posts_id" integer,
  	"pricing_id" integer,
  	"faq_id" integer,
  	"team_id" integer
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
  
  CREATE TABLE "header_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link" varchar NOT NULL
  );
  
  CREATE TABLE "header_navigation_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_button_link" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"cta_button_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link" varchar NOT NULL
  );
  
  CREATE TABLE "footer_navigation_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_platform",
  	"url" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"description" varchar,
  	"copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Content Hunter',
  	"default_meta_og_image_id" integer,
  	"contacts_telegram" varchar,
  	"contacts_telegram_bot" varchar,
  	"contacts_whatsapp" varchar,
  	"contacts_email" varchar,
  	"analytics_google_analytics_id" varchar,
  	"analytics_yandex_metrika_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_locales" (
  	"site_description" varchar,
  	"default_meta_title" varchar,
  	"default_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "home_page_hero_cycle_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar
  );
  
  CREATE TABLE "home_page_problem_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "home_page_problem_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_solution_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_solution_checklist_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_solution_formula_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"label" varchar
  );
  
  CREATE TABLE "home_page_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "home_page_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "home_page_how_it_works_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_video_examples_items_instagram_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "home_page_video_examples_items_youtube_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "home_page_video_examples_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_video_examples_items_locales" (
  	"client" varchar,
  	"format" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_niches_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "home_page_niches_items_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_comparison_competitors_cons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_comparison_competitors_cons_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_comparison_competitors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_comparison_competitors_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_comparison_our_advantages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_comparison_our_advantages_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_cta_guarantees" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_cta_guarantees_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_telegram_link" varchar,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_headline" varchar,
  	"hero_subheadline" varchar,
  	"problem_title" varchar,
  	"problem_text" varchar,
  	"solution_title" varchar,
  	"solution_title_highlight" varchar,
  	"solution_formula" varchar,
  	"solution_text" varchar,
  	"how_it_works_title" varchar,
  	"how_it_works_subtitle" varchar,
  	"video_examples_title" varchar,
  	"video_examples_subtitle" varchar,
  	"niches_title" varchar,
  	"niches_subtitle" varchar,
  	"comparison_title" varchar,
  	"comparison_subtitle" varchar,
  	"cta_headline" varchar,
  	"cta_headline_highlight" varchar,
  	"cta_text" varchar,
  	"cta_primary_button_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_page_what_is_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_page_what_is_paragraphs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_page_what_is_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_page_what_is_benefits_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_page_what_is_formula_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "services_page_formats_items_platforms" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "services_page_formats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "services_page_formats_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_page_stages_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"duration" varchar
  );
  
  CREATE TABLE "services_page_stages_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_page_scaling_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "services_page_scaling_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_page_locales" (
  	"hero_headline" varchar,
  	"hero_headline_highlight" varchar,
  	"hero_subheadline" varchar,
  	"hero_primary_button_text" varchar,
  	"hero_secondary_button_text" varchar,
  	"what_is_title" varchar,
  	"formats_title" varchar,
  	"formats_subtitle" varchar,
  	"stages_title" varchar,
  	"stages_subtitle" varchar,
  	"scaling_title" varchar,
  	"scaling_subtitle" varchar,
  	"cta_headline" varchar,
  	"cta_headline_highlight" varchar,
  	"cta_text" varchar,
  	"cta_primary_button_text" varchar,
  	"cta_secondary_button_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "about_page_story_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_page_story_paragraphs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "about_page_values_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_geography_regions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_company_name" varchar,
  	"company_brand" varchar,
  	"company_founder" varchar,
  	"company_year" varchar,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"hero_headline" varchar,
  	"hero_subheadline" varchar,
  	"story_title" varchar,
  	"values_title" varchar,
  	"values_subtitle" varchar,
  	"geography_title" varchar,
  	"geography_text" varchar,
  	"company_title" varchar,
  	"cta_headline" varchar,
  	"cta_text" varchar,
  	"cta_button_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pricing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pricing_page_locales" (
  	"hero_headline" varchar,
  	"hero_subheadline" varchar,
  	"cta_headline" varchar,
  	"cta_text" varchar,
  	"cta_button_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faq_page_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "faq_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "faq_page_locales" (
  	"hero_headline" varchar,
  	"hero_headline_highlight" varchar,
  	"hero_subheadline" varchar,
  	"hero_button_text" varchar,
  	"cta_headline" varchar,
  	"cta_text" varchar,
  	"cta_button_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_locales" ADD CONSTRAINT "pages_blocks_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_features_locales" ADD CONSTRAINT "pages_blocks_features_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_locales" ADD CONSTRAINT "pages_blocks_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases_social_links" ADD CONSTRAINT "cases_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cases" ADD CONSTRAINT "cases_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cases_locales" ADD CONSTRAINT "cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_team_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_locales" ADD CONSTRAINT "blog_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_features" ADD CONSTRAINT "pricing_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_features_locales" ADD CONSTRAINT "pricing_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_locales" ADD CONSTRAINT "pricing_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_locales" ADD CONSTRAINT "faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_locales" ADD CONSTRAINT "team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pricing_fk" FOREIGN KEY ("pricing_id") REFERENCES "public"."pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation" ADD CONSTRAINT "header_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation_locales" ADD CONSTRAINT "header_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation" ADD CONSTRAINT "footer_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_locales" ADD CONSTRAINT "footer_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social" ADD CONSTRAINT "footer_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_default_meta_og_image_id_media_id_fk" FOREIGN KEY ("default_meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_locales" ADD CONSTRAINT "settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_stats" ADD CONSTRAINT "home_page_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_cycle_words" ADD CONSTRAINT "home_page_hero_cycle_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_problem_items" ADD CONSTRAINT "home_page_problem_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_problem_items_locales" ADD CONSTRAINT "home_page_problem_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_problem_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_solution_checklist" ADD CONSTRAINT "home_page_solution_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_solution_checklist_locales" ADD CONSTRAINT "home_page_solution_checklist_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_solution_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_solution_formula_stats" ADD CONSTRAINT "home_page_solution_formula_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_stats_items" ADD CONSTRAINT "home_page_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_how_it_works_steps" ADD CONSTRAINT "home_page_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_how_it_works_steps_locales" ADD CONSTRAINT "home_page_how_it_works_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_how_it_works_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_video_examples_items_instagram_ids" ADD CONSTRAINT "home_page_video_examples_items_instagram_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_video_examples_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_video_examples_items_youtube_ids" ADD CONSTRAINT "home_page_video_examples_items_youtube_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_video_examples_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_video_examples_items" ADD CONSTRAINT "home_page_video_examples_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_video_examples_items_locales" ADD CONSTRAINT "home_page_video_examples_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_video_examples_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_niches_items" ADD CONSTRAINT "home_page_niches_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_niches_items_locales" ADD CONSTRAINT "home_page_niches_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_niches_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_comparison_competitors_cons" ADD CONSTRAINT "home_page_comparison_competitors_cons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_comparison_competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_comparison_competitors_cons_locales" ADD CONSTRAINT "home_page_comparison_competitors_cons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_comparison_competitors_cons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_comparison_competitors" ADD CONSTRAINT "home_page_comparison_competitors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_comparison_competitors_locales" ADD CONSTRAINT "home_page_comparison_competitors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_comparison_competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_comparison_our_advantages" ADD CONSTRAINT "home_page_comparison_our_advantages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_comparison_our_advantages_locales" ADD CONSTRAINT "home_page_comparison_our_advantages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_comparison_our_advantages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_cta_guarantees" ADD CONSTRAINT "home_page_cta_guarantees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_cta_guarantees_locales" ADD CONSTRAINT "home_page_cta_guarantees_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_cta_guarantees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_what_is_paragraphs" ADD CONSTRAINT "services_page_what_is_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_what_is_paragraphs_locales" ADD CONSTRAINT "services_page_what_is_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_what_is_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_what_is_benefits" ADD CONSTRAINT "services_page_what_is_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_what_is_benefits_locales" ADD CONSTRAINT "services_page_what_is_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_what_is_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_what_is_formula_values" ADD CONSTRAINT "services_page_what_is_formula_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_formats_items_platforms" ADD CONSTRAINT "services_page_formats_items_platforms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_formats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_formats_items" ADD CONSTRAINT "services_page_formats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_formats_items_locales" ADD CONSTRAINT "services_page_formats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_formats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_stages_items" ADD CONSTRAINT "services_page_stages_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_stages_items_locales" ADD CONSTRAINT "services_page_stages_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_stages_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_scaling_items" ADD CONSTRAINT "services_page_scaling_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_scaling_items_locales" ADD CONSTRAINT "services_page_scaling_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page_scaling_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page" ADD CONSTRAINT "services_page_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page_locales" ADD CONSTRAINT "services_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_stats_items" ADD CONSTRAINT "about_page_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_story_paragraphs" ADD CONSTRAINT "about_page_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_story_paragraphs_locales" ADD CONSTRAINT "about_page_story_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_story_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values_items" ADD CONSTRAINT "about_page_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values_items_locales" ADD CONSTRAINT "about_page_values_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_values_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_geography_regions" ADD CONSTRAINT "about_page_geography_regions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_page" ADD CONSTRAINT "pricing_page_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pricing_page_locales" ADD CONSTRAINT "pricing_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_page_categories" ADD CONSTRAINT "faq_page_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_page" ADD CONSTRAINT "faq_page_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_page_locales" ADD CONSTRAINT "faq_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_content_locales_locale_parent_id_unique" ON "pages_blocks_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_features_features_order_idx" ON "pages_blocks_features_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_features_parent_id_idx" ON "pages_blocks_features_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_features_features_locales_locale_parent_id_uniq" ON "pages_blocks_features_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_features_locales_locale_parent_id_unique" ON "pages_blocks_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cases_social_links_order_idx" ON "cases_social_links" USING btree ("_order");
  CREATE INDEX "cases_social_links_parent_id_idx" ON "cases_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cases_slug_idx" ON "cases" USING btree ("slug");
  CREATE INDEX "cases_image_idx" ON "cases" USING btree ("image_id");
  CREATE INDEX "cases_updated_at_idx" ON "cases" USING btree ("updated_at");
  CREATE INDEX "cases_created_at_idx" ON "cases" USING btree ("created_at");
  CREATE UNIQUE INDEX "cases_locales_locale_parent_id_unique" ON "cases_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_image_idx" ON "blog_posts" USING btree ("image_id");
  CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_posts_locales_locale_parent_id_unique" ON "blog_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pricing_features_order_idx" ON "pricing_features" USING btree ("_order");
  CREATE INDEX "pricing_features_parent_id_idx" ON "pricing_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pricing_features_locales_locale_parent_id_unique" ON "pricing_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pricing_updated_at_idx" ON "pricing" USING btree ("updated_at");
  CREATE INDEX "pricing_created_at_idx" ON "pricing" USING btree ("created_at");
  CREATE UNIQUE INDEX "pricing_locales_locale_parent_id_unique" ON "pricing_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE UNIQUE INDEX "faq_locales_locale_parent_id_unique" ON "faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_photo_idx" ON "team" USING btree ("photo_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_locales_locale_parent_id_unique" ON "team_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("cases_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_pricing_id_idx" ON "payload_locked_documents_rels" USING btree ("pricing_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_navigation_order_idx" ON "header_navigation" USING btree ("_order");
  CREATE INDEX "header_navigation_parent_id_idx" ON "header_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_navigation_locales_locale_parent_id_unique" ON "header_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_navigation_order_idx" ON "footer_navigation" USING btree ("_order");
  CREATE INDEX "footer_navigation_parent_id_idx" ON "footer_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_navigation_locales_locale_parent_id_unique" ON "footer_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_social_order_idx" ON "footer_social" USING btree ("_order");
  CREATE INDEX "footer_social_parent_id_idx" ON "footer_social" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "settings_default_meta_default_meta_og_image_idx" ON "settings" USING btree ("default_meta_og_image_id");
  CREATE UNIQUE INDEX "settings_locales_locale_parent_id_unique" ON "settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_stats_order_idx" ON "home_page_hero_stats" USING btree ("_order");
  CREATE INDEX "home_page_hero_stats_parent_id_idx" ON "home_page_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_cycle_words_order_idx" ON "home_page_hero_cycle_words" USING btree ("_order");
  CREATE INDEX "home_page_hero_cycle_words_parent_id_idx" ON "home_page_hero_cycle_words" USING btree ("_parent_id");
  CREATE INDEX "home_page_problem_items_order_idx" ON "home_page_problem_items" USING btree ("_order");
  CREATE INDEX "home_page_problem_items_parent_id_idx" ON "home_page_problem_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_problem_items_locales_locale_parent_id_unique" ON "home_page_problem_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_solution_checklist_order_idx" ON "home_page_solution_checklist" USING btree ("_order");
  CREATE INDEX "home_page_solution_checklist_parent_id_idx" ON "home_page_solution_checklist" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_solution_checklist_locales_locale_parent_id_unique" ON "home_page_solution_checklist_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_solution_formula_stats_order_idx" ON "home_page_solution_formula_stats" USING btree ("_order");
  CREATE INDEX "home_page_solution_formula_stats_parent_id_idx" ON "home_page_solution_formula_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_stats_items_order_idx" ON "home_page_stats_items" USING btree ("_order");
  CREATE INDEX "home_page_stats_items_parent_id_idx" ON "home_page_stats_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_how_it_works_steps_order_idx" ON "home_page_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "home_page_how_it_works_steps_parent_id_idx" ON "home_page_how_it_works_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_how_it_works_steps_locales_locale_parent_id_unique" ON "home_page_how_it_works_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_video_examples_items_instagram_ids_order_idx" ON "home_page_video_examples_items_instagram_ids" USING btree ("_order");
  CREATE INDEX "home_page_video_examples_items_instagram_ids_parent_id_idx" ON "home_page_video_examples_items_instagram_ids" USING btree ("_parent_id");
  CREATE INDEX "home_page_video_examples_items_youtube_ids_order_idx" ON "home_page_video_examples_items_youtube_ids" USING btree ("_order");
  CREATE INDEX "home_page_video_examples_items_youtube_ids_parent_id_idx" ON "home_page_video_examples_items_youtube_ids" USING btree ("_parent_id");
  CREATE INDEX "home_page_video_examples_items_order_idx" ON "home_page_video_examples_items" USING btree ("_order");
  CREATE INDEX "home_page_video_examples_items_parent_id_idx" ON "home_page_video_examples_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_video_examples_items_locales_locale_parent_id_uniq" ON "home_page_video_examples_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_niches_items_order_idx" ON "home_page_niches_items" USING btree ("_order");
  CREATE INDEX "home_page_niches_items_parent_id_idx" ON "home_page_niches_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_niches_items_locales_locale_parent_id_unique" ON "home_page_niches_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_comparison_competitors_cons_order_idx" ON "home_page_comparison_competitors_cons" USING btree ("_order");
  CREATE INDEX "home_page_comparison_competitors_cons_parent_id_idx" ON "home_page_comparison_competitors_cons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_comparison_competitors_cons_locales_locale_parent_" ON "home_page_comparison_competitors_cons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_comparison_competitors_order_idx" ON "home_page_comparison_competitors" USING btree ("_order");
  CREATE INDEX "home_page_comparison_competitors_parent_id_idx" ON "home_page_comparison_competitors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_comparison_competitors_locales_locale_parent_id_un" ON "home_page_comparison_competitors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_comparison_our_advantages_order_idx" ON "home_page_comparison_our_advantages" USING btree ("_order");
  CREATE INDEX "home_page_comparison_our_advantages_parent_id_idx" ON "home_page_comparison_our_advantages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_comparison_our_advantages_locales_locale_parent_id" ON "home_page_comparison_our_advantages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_cta_guarantees_order_idx" ON "home_page_cta_guarantees" USING btree ("_order");
  CREATE INDEX "home_page_cta_guarantees_parent_id_idx" ON "home_page_cta_guarantees" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_cta_guarantees_locales_locale_parent_id_unique" ON "home_page_cta_guarantees_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_meta_meta_og_image_idx" ON "home_page" USING btree ("meta_og_image_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_what_is_paragraphs_order_idx" ON "services_page_what_is_paragraphs" USING btree ("_order");
  CREATE INDEX "services_page_what_is_paragraphs_parent_id_idx" ON "services_page_what_is_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_page_what_is_paragraphs_locales_locale_parent_id_un" ON "services_page_what_is_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_what_is_benefits_order_idx" ON "services_page_what_is_benefits" USING btree ("_order");
  CREATE INDEX "services_page_what_is_benefits_parent_id_idx" ON "services_page_what_is_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_page_what_is_benefits_locales_locale_parent_id_uniq" ON "services_page_what_is_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_what_is_formula_values_order_idx" ON "services_page_what_is_formula_values" USING btree ("_order");
  CREATE INDEX "services_page_what_is_formula_values_parent_id_idx" ON "services_page_what_is_formula_values" USING btree ("_parent_id");
  CREATE INDEX "services_page_formats_items_platforms_order_idx" ON "services_page_formats_items_platforms" USING btree ("_order");
  CREATE INDEX "services_page_formats_items_platforms_parent_id_idx" ON "services_page_formats_items_platforms" USING btree ("_parent_id");
  CREATE INDEX "services_page_formats_items_order_idx" ON "services_page_formats_items" USING btree ("_order");
  CREATE INDEX "services_page_formats_items_parent_id_idx" ON "services_page_formats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_page_formats_items_locales_locale_parent_id_unique" ON "services_page_formats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_stages_items_order_idx" ON "services_page_stages_items" USING btree ("_order");
  CREATE INDEX "services_page_stages_items_parent_id_idx" ON "services_page_stages_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_page_stages_items_locales_locale_parent_id_unique" ON "services_page_stages_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_scaling_items_order_idx" ON "services_page_scaling_items" USING btree ("_order");
  CREATE INDEX "services_page_scaling_items_parent_id_idx" ON "services_page_scaling_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_page_scaling_items_locales_locale_parent_id_unique" ON "services_page_scaling_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_page_meta_meta_og_image_idx" ON "services_page" USING btree ("meta_og_image_id");
  CREATE UNIQUE INDEX "services_page_locales_locale_parent_id_unique" ON "services_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_stats_items_order_idx" ON "about_page_stats_items" USING btree ("_order");
  CREATE INDEX "about_page_stats_items_parent_id_idx" ON "about_page_stats_items" USING btree ("_parent_id");
  CREATE INDEX "about_page_story_paragraphs_order_idx" ON "about_page_story_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_story_paragraphs_parent_id_idx" ON "about_page_story_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_story_paragraphs_locales_locale_parent_id_unique" ON "about_page_story_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_values_items_order_idx" ON "about_page_values_items" USING btree ("_order");
  CREATE INDEX "about_page_values_items_parent_id_idx" ON "about_page_values_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_values_items_locales_locale_parent_id_unique" ON "about_page_values_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_geography_regions_order_idx" ON "about_page_geography_regions" USING btree ("_order");
  CREATE INDEX "about_page_geography_regions_parent_id_idx" ON "about_page_geography_regions" USING btree ("_parent_id");
  CREATE INDEX "about_page_meta_meta_og_image_idx" ON "about_page" USING btree ("meta_og_image_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pricing_page_meta_meta_og_image_idx" ON "pricing_page" USING btree ("meta_og_image_id");
  CREATE UNIQUE INDEX "pricing_page_locales_locale_parent_id_unique" ON "pricing_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faq_page_categories_order_idx" ON "faq_page_categories" USING btree ("_order");
  CREATE INDEX "faq_page_categories_parent_id_idx" ON "faq_page_categories" USING btree ("_parent_id");
  CREATE INDEX "faq_page_meta_meta_og_image_idx" ON "faq_page" USING btree ("meta_og_image_id");
  CREATE UNIQUE INDEX "faq_page_locales_locale_parent_id_unique" ON "faq_page_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_content_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_blocks_features_features" CASCADE;
  DROP TABLE "pages_blocks_features_features_locales" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_features_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "cases_social_links" CASCADE;
  DROP TABLE "cases" CASCADE;
  DROP TABLE "cases_locales" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "blog_posts_locales" CASCADE;
  DROP TABLE "pricing_features" CASCADE;
  DROP TABLE "pricing_features_locales" CASCADE;
  DROP TABLE "pricing" CASCADE;
  DROP TABLE "pricing_locales" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "faq_locales" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "team_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_navigation" CASCADE;
  DROP TABLE "header_navigation_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "footer_navigation" CASCADE;
  DROP TABLE "footer_navigation_locales" CASCADE;
  DROP TABLE "footer_social" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_locales" CASCADE;
  DROP TABLE "home_page_hero_stats" CASCADE;
  DROP TABLE "home_page_hero_cycle_words" CASCADE;
  DROP TABLE "home_page_problem_items" CASCADE;
  DROP TABLE "home_page_problem_items_locales" CASCADE;
  DROP TABLE "home_page_solution_checklist" CASCADE;
  DROP TABLE "home_page_solution_checklist_locales" CASCADE;
  DROP TABLE "home_page_solution_formula_stats" CASCADE;
  DROP TABLE "home_page_stats_items" CASCADE;
  DROP TABLE "home_page_how_it_works_steps" CASCADE;
  DROP TABLE "home_page_how_it_works_steps_locales" CASCADE;
  DROP TABLE "home_page_video_examples_items_instagram_ids" CASCADE;
  DROP TABLE "home_page_video_examples_items_youtube_ids" CASCADE;
  DROP TABLE "home_page_video_examples_items" CASCADE;
  DROP TABLE "home_page_video_examples_items_locales" CASCADE;
  DROP TABLE "home_page_niches_items" CASCADE;
  DROP TABLE "home_page_niches_items_locales" CASCADE;
  DROP TABLE "home_page_comparison_competitors_cons" CASCADE;
  DROP TABLE "home_page_comparison_competitors_cons_locales" CASCADE;
  DROP TABLE "home_page_comparison_competitors" CASCADE;
  DROP TABLE "home_page_comparison_competitors_locales" CASCADE;
  DROP TABLE "home_page_comparison_our_advantages" CASCADE;
  DROP TABLE "home_page_comparison_our_advantages_locales" CASCADE;
  DROP TABLE "home_page_cta_guarantees" CASCADE;
  DROP TABLE "home_page_cta_guarantees_locales" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "services_page_what_is_paragraphs" CASCADE;
  DROP TABLE "services_page_what_is_paragraphs_locales" CASCADE;
  DROP TABLE "services_page_what_is_benefits" CASCADE;
  DROP TABLE "services_page_what_is_benefits_locales" CASCADE;
  DROP TABLE "services_page_what_is_formula_values" CASCADE;
  DROP TABLE "services_page_formats_items_platforms" CASCADE;
  DROP TABLE "services_page_formats_items" CASCADE;
  DROP TABLE "services_page_formats_items_locales" CASCADE;
  DROP TABLE "services_page_stages_items" CASCADE;
  DROP TABLE "services_page_stages_items_locales" CASCADE;
  DROP TABLE "services_page_scaling_items" CASCADE;
  DROP TABLE "services_page_scaling_items_locales" CASCADE;
  DROP TABLE "services_page" CASCADE;
  DROP TABLE "services_page_locales" CASCADE;
  DROP TABLE "about_page_stats_items" CASCADE;
  DROP TABLE "about_page_story_paragraphs" CASCADE;
  DROP TABLE "about_page_story_paragraphs_locales" CASCADE;
  DROP TABLE "about_page_values_items" CASCADE;
  DROP TABLE "about_page_values_items_locales" CASCADE;
  DROP TABLE "about_page_geography_regions" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "pricing_page" CASCADE;
  DROP TABLE "pricing_page_locales" CASCADE;
  DROP TABLE "faq_page_categories" CASCADE;
  DROP TABLE "faq_page" CASCADE;
  DROP TABLE "faq_page_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_cases_social_links_platform";
  DROP TYPE "public"."enum_cases_niche";
  DROP TYPE "public"."enum_cases_currency";
  DROP TYPE "public"."enum_blog_posts_category";
  DROP TYPE "public"."enum_pricing_currency";
  DROP TYPE "public"."enum_faq_category";
  DROP TYPE "public"."enum_footer_social_platform";`)
}
