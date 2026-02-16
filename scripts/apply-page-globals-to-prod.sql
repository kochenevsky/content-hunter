-- Применить в Supabase Dashboard → SQL Editor проекта feytgokjblyqzymadfym (production)
-- Колонка analytics_custom_head_scripts (если её нет)
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS analytics_custom_head_scripts varchar;

-- Кнопки hero/cta (home_page, services_page)
ALTER TABLE home_page ADD COLUMN IF NOT EXISTS hero_primary_button_link varchar;
ALTER TABLE home_page ADD COLUMN IF NOT EXISTS hero_secondary_button_link varchar;
ALTER TABLE home_page ADD COLUMN IF NOT EXISTS cta_primary_button_link varchar;
ALTER TABLE home_page ADD COLUMN IF NOT EXISTS cta_telegram_link varchar;
ALTER TABLE home_page_locales ADD COLUMN IF NOT EXISTS hero_primary_button_text varchar;
ALTER TABLE home_page_locales ADD COLUMN IF NOT EXISTS hero_secondary_button_text varchar;
ALTER TABLE home_page_locales ADD COLUMN IF NOT EXISTS cta_secondary_button_text varchar;
ALTER TABLE services_page ADD COLUMN IF NOT EXISTS hero_primary_button_link varchar;
ALTER TABLE services_page ADD COLUMN IF NOT EXISTS hero_secondary_button_link varchar;
ALTER TABLE services_page ADD COLUMN IF NOT EXISTS cta_primary_button_link varchar;
ALTER TABLE services_page ADD COLUMN IF NOT EXISTS cta_secondary_button_link varchar;
ALTER TABLE pricing_page ADD COLUMN IF NOT EXISTS cta_button_link varchar;
ALTER TABLE about_page ADD COLUMN IF NOT EXISTS cta_button_link varchar;
ALTER TABLE faq_page ADD COLUMN IF NOT EXISTS hero_button_link varchar;
ALTER TABLE faq_page ADD COLUMN IF NOT EXISTS cta_button_link varchar;
ALTER TABLE pricing ADD COLUMN IF NOT EXISTS cta_link varchar;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS cta_link varchar;
ALTER TABLE cases_locales ADD COLUMN IF NOT EXISTS cta_text varchar;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cta_link varchar;
ALTER TABLE blog_posts_locales ADD COLUMN IF NOT EXISTS cta_text varchar;

-- Footer materials (Презентация, Прайс)
CREATE TABLE IF NOT EXISTS footer_materials (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES footer(id) ON DELETE CASCADE, id varchar PRIMARY KEY, link varchar NOT NULL);
CREATE TABLE IF NOT EXISTS footer_materials_locales (label varchar NOT NULL, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES footer_materials(id) ON DELETE CASCADE);
-- Ссылка: https://supabase.com/dashboard/project/feytgokjblyqzymadfym/sql/new

-- 1. Таблицы глобалов Главная, Услуги, О нас, Тарифы, FAQ
-- home_page и дочерние
CREATE TABLE IF NOT EXISTS home_page (
  id serial PRIMARY KEY,
  cta_telegram_link varchar,
  meta_og_image_id integer REFERENCES media(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS home_page_locales (
  hero_headline varchar, hero_subheadline varchar, problem_title varchar, problem_text varchar,
  solution_title varchar, solution_title_highlight varchar, solution_formula varchar, solution_text varchar,
  how_it_works_title varchar, how_it_works_subtitle varchar, video_examples_title varchar, video_examples_subtitle varchar,
  niches_title varchar, niches_subtitle varchar, comparison_title varchar, comparison_subtitle varchar,
  cta_headline varchar, cta_headline_highlight varchar, cta_text varchar, cta_primary_button_text varchar,
  meta_title varchar, meta_description varchar,
  id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS home_page_hero_stats (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, value varchar, suffix varchar, label varchar);
CREATE TABLE IF NOT EXISTS home_page_hero_cycle_words (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, word varchar);
CREATE TABLE IF NOT EXISTS home_page_problem_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, icon varchar);
CREATE TABLE IF NOT EXISTS home_page_problem_items_locales (title varchar, description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_problem_items(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS home_page_solution_checklist (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS home_page_solution_checklist_locales (item varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_solution_checklist(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS home_page_solution_formula_stats (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, value numeric, label varchar);
CREATE TABLE IF NOT EXISTS home_page_stats_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, value numeric, suffix varchar, label varchar);
CREATE TABLE IF NOT EXISTS home_page_how_it_works_steps (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, icon varchar);
CREATE TABLE IF NOT EXISTS home_page_how_it_works_steps_locales (title varchar, description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_how_it_works_steps(id) ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS home_page_video_examples_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS home_page_video_examples_items_locales (client varchar, format varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_video_examples_items(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS home_page_video_examples_items_instagram_ids (_order integer NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_video_examples_items(id) ON DELETE CASCADE, id varchar PRIMARY KEY, label varchar);
CREATE TABLE IF NOT EXISTS home_page_video_examples_items_youtube_ids (_order integer NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_video_examples_items(id) ON DELETE CASCADE, id varchar PRIMARY KEY, label varchar);
CREATE TABLE IF NOT EXISTS home_page_video_examples_items_vimeo_ids (_order integer NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_video_examples_items(id) ON DELETE CASCADE, id varchar PRIMARY KEY, label varchar);

CREATE TABLE IF NOT EXISTS home_page_niches_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, icon varchar);
CREATE TABLE IF NOT EXISTS home_page_niches_items_locales (name varchar, description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_niches_items(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS home_page_comparison_competitors (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS home_page_comparison_competitors_locales (title varchar, description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_comparison_competitors(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS home_page_comparison_competitors_cons (_order integer NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_comparison_competitors(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS home_page_comparison_competitors_cons_locales (item varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_comparison_competitors_cons(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS home_page_comparison_our_advantages (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS home_page_comparison_our_advantages_locales (item varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_comparison_our_advantages(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS home_page_cta_guarantees (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES home_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS home_page_cta_guarantees_locales (item varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES home_page_cta_guarantees(id) ON DELETE CASCADE);

-- services_page
CREATE TABLE IF NOT EXISTS services_page (id serial PRIMARY KEY, meta_og_image_id integer REFERENCES media(id) ON DELETE SET NULL, updated_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS services_page_locales (hero_headline varchar, hero_headline_highlight varchar, hero_subheadline varchar, hero_primary_button_text varchar, hero_secondary_button_text varchar, what_is_title varchar, formats_title varchar, formats_subtitle varchar, stages_title varchar, stages_subtitle varchar, scaling_title varchar, scaling_subtitle varchar, cta_headline varchar, cta_headline_highlight varchar, cta_text varchar, cta_primary_button_text varchar, cta_secondary_button_text varchar, meta_title varchar, meta_description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id integer NOT NULL REFERENCES services_page(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS services_page_what_is_paragraphs (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES services_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS services_page_what_is_paragraphs_locales (text varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES services_page_what_is_paragraphs(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS services_page_what_is_benefits (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES services_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS services_page_what_is_benefits_locales (item varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES services_page_what_is_benefits(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS services_page_what_is_formula_values (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES services_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, value varchar, label varchar);
CREATE TABLE IF NOT EXISTS services_page_formats_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES services_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, icon varchar);
CREATE TABLE IF NOT EXISTS services_page_formats_items_locales (title varchar, description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES services_page_formats_items(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS services_page_formats_items_platforms (_order integer NOT NULL, _parent_id varchar NOT NULL REFERENCES services_page_formats_items(id) ON DELETE CASCADE, id varchar PRIMARY KEY, name varchar);
CREATE TABLE IF NOT EXISTS services_page_stages_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES services_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, number varchar, duration varchar);
CREATE TABLE IF NOT EXISTS services_page_stages_items_locales (title varchar, description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES services_page_stages_items(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS services_page_scaling_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES services_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, icon varchar);
CREATE TABLE IF NOT EXISTS services_page_scaling_items_locales (title varchar, description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES services_page_scaling_items(id) ON DELETE CASCADE);

-- about_page
CREATE TABLE IF NOT EXISTS about_page (id serial PRIMARY KEY, company_company_name varchar, company_brand varchar, company_founder varchar, company_year varchar, meta_og_image_id integer REFERENCES media(id) ON DELETE SET NULL, updated_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS about_page_locales (hero_headline varchar, hero_subheadline varchar, story_title varchar, values_title varchar, values_subtitle varchar, geography_title varchar, geography_text varchar, company_title varchar, cta_headline varchar, cta_text varchar, cta_button_text varchar, meta_title varchar, meta_description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id integer NOT NULL REFERENCES about_page(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS about_page_stats_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES about_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, value varchar, label varchar);
CREATE TABLE IF NOT EXISTS about_page_story_paragraphs (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES about_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY);
CREATE TABLE IF NOT EXISTS about_page_story_paragraphs_locales (text varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES about_page_story_paragraphs(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS about_page_values_items (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES about_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, icon varchar);
CREATE TABLE IF NOT EXISTS about_page_values_items_locales (title varchar, description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id varchar NOT NULL REFERENCES about_page_values_items(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS about_page_geography_regions (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES about_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, name varchar);

-- pricing_page
CREATE TABLE IF NOT EXISTS pricing_page (id serial PRIMARY KEY, meta_og_image_id integer REFERENCES media(id) ON DELETE SET NULL, updated_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS pricing_page_locales (hero_headline varchar, hero_subheadline varchar, cta_headline varchar, cta_text varchar, cta_button_text varchar, meta_title varchar, meta_description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id integer NOT NULL REFERENCES pricing_page(id) ON DELETE CASCADE);

-- faq_page
CREATE TABLE IF NOT EXISTS faq_page (id serial PRIMARY KEY, meta_og_image_id integer REFERENCES media(id) ON DELETE SET NULL, updated_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS faq_page_locales (hero_headline varchar, hero_headline_highlight varchar, hero_subheadline varchar, hero_button_text varchar, cta_headline varchar, cta_text varchar, cta_button_text varchar, meta_title varchar, meta_description varchar, id serial PRIMARY KEY, _locale public._locales NOT NULL, _parent_id integer NOT NULL REFERENCES faq_page(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS faq_page_categories (_order integer NOT NULL, _parent_id integer NOT NULL REFERENCES faq_page(id) ON DELETE CASCADE, id varchar PRIMARY KEY, label varchar);

-- 2. Строки по умолчанию (header, footer, settings, home_page, services_page, about_page, pricing_page, faq_page)
INSERT INTO public.header (logo_id) SELECT NULL FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM public.header LIMIT 1);
INSERT INTO public.footer SELECT nextval('footer_id_seq'), now(), now() FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM public.footer LIMIT 1);
INSERT INTO public.settings (site_name) SELECT 'Content Hunter' FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM public.settings LIMIT 1);
INSERT INTO home_page (id) SELECT 1 FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM home_page LIMIT 1);
INSERT INTO services_page (id) SELECT 1 FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM services_page LIMIT 1);
INSERT INTO about_page (id) SELECT 1 FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM about_page LIMIT 1);
INSERT INTO pricing_page (id) SELECT 1 FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM pricing_page LIMIT 1);
INSERT INTO faq_page (id) SELECT 1 FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM faq_page LIMIT 1);
