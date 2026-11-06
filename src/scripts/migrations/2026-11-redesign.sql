-- 懂陸姐網站改版 (提案 CL-20261006-001 修訂三)
-- Additive and idempotent. Must be applied BEFORE deploying the redesign code,
-- because the ORM selects these columns on every post query.

ALTER TABLE categories ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

ALTER TABLE posts ADD COLUMN IF NOT EXISTS section text NOT NULL DEFAULT 'opinion';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image_alt text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS focus_keyword text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_title text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_description text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS faq jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS related_post_ids jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS schedule_error text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS ai_source jsonb;

CREATE INDEX IF NOT EXISTS posts_section_status_published_idx ON posts (section, status, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_scheduled_due_idx ON posts (scheduled_at) WHERE status = 'scheduled';

CREATE TABLE IF NOT EXISTS post_slug_redirects (
  id serial PRIMARY KEY,
  old_slug text NOT NULL UNIQUE,
  post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_faqs (
  id serial PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  related_post_id integer REFERENCES posts(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'published',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_assistant_logs (
  id serial PRIMARY KEY,
  username text NOT NULL,
  action text NOT NULL,
  model text,
  status text NOT NULL,
  error text,
  duration_ms integer,
  created_at timestamp DEFAULT now()
);

-- The four article categories confirmed by Tina (2026-10-06).
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('電商與平台', 'ecommerce-platforms', '電商平台、跨境電商、平台規則與經營。', 1),
  ('零售與消費', 'retail-consumer', '零售通路、消費趨勢、品牌與市場。', 2),
  ('To B 與產業供應鏈', 'b2b-supply-chain', '企業採購、產業帶、製造與供應鏈。', 3),
  ('新媒體與流量', 'new-media-traffic', '社群平台、內容行銷、流量與帳號經營。', 4)
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

-- Retire the earlier categories only when no post uses them.
DELETE FROM categories c
WHERE c.slug IN ('xiaohongshu-guides', 'xiaohongshu-ecommerce', 'douyin-guides', 'platform-strategy')
  AND NOT EXISTS (SELECT 1 FROM posts p WHERE p.category_id = c.id);
