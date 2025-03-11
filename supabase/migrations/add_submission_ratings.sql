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

-- Enable Row Level Security (RLS)
ALTER TABLE submission_ratings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Submission ratings are viewable by everyone" ON submission_ratings;
DROP POLICY IF EXISTS "Authenticated users can rate submissions" ON submission_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON submission_ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON submission_ratings;

-- Create policies for submission_ratings
-- Anyone can read ratings
CREATE POLICY "Submission ratings are viewable by everyone" 
  ON submission_ratings FOR SELECT USING (true);

-- Authenticated users can rate submissions
CREATE POLICY "Authenticated users can rate submissions" 
  ON submission_ratings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings" 
  ON submission_ratings FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete their own ratings" 
  ON submission_ratings FOR DELETE USING (auth.uid() = user_id); 