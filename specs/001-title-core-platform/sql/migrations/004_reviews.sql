-- 004_reviews.sql
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  quality smallint,
  communication smallint,
  expertise smallint,
  deadlines smallint,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- RLS policy examples (commented):
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- -- Allow insertion only if the reviewer is part of the project (business rule)
-- CREATE POLICY "reviews_insert_reviewer" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
-- CREATE POLICY "reviews_select_public" ON reviews FOR SELECT USING (true);
