-- Simple version of add_submission_ratings.sql without policies
-- Use this if you're having issues with policy syntax errors

-- Create submission ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS submission_ratings (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);

-- Create view for submissions with ratings
CREATE OR REPLACE VIEW submissions_with_ratings AS
SELECT 
  s.*,
  COALESCE(AVG(sr.rating), 0) AS avg_rating,
  COUNT(sr.id) AS rating_count
FROM 
  submissions s
LEFT JOIN 
  submission_ratings sr ON s.id = sr.submission_id
GROUP BY 
  s.id;

-- Note: This version doesn't include RLS policies
-- If you need RLS, run these commands separately after this script:

/*
-- Enable Row Level Security (RLS)
ALTER TABLE submission_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies one by one
CREATE POLICY "Submission ratings are viewable by everyone" 
  ON submission_ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rate submissions" 
  ON submission_ratings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own ratings" 
  ON submission_ratings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
  ON submission_ratings FOR DELETE USING (auth.uid() = user_id);
*/ 