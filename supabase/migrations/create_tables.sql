-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  frequency TEXT NOT NULL CHECK (frequency IN ('low', 'medium', 'high')),
  tags JSONB,
  companies JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  files JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create submission ratings table
CREATE TABLE IF NOT EXISTS submission_ratings (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);

-- Create submission comments table
CREATE TABLE IF NOT EXISTS submission_comments (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES submission_comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create views for easier querying

-- Comments with like counts
CREATE OR REPLACE VIEW comments_with_likes AS
SELECT 
  c.*,
  COUNT(cl.id) AS likes_count
FROM 
  comments c
LEFT JOIN 
  comment_likes cl ON c.id = cl.comment_id
GROUP BY 
  c.id;

-- Submissions with rating averages
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
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- Challenges: anyone can read, only authenticated users can create
CREATE POLICY IF NOT EXISTS "Challenges are viewable by everyone" 
  ON challenges FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can create challenges" 
  ON challenges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update their own challenges" 
  ON challenges FOR UPDATE USING (auth.uid() = user_id);

-- Submissions: anyone can read, only authenticated users can create
CREATE POLICY IF NOT EXISTS "Submissions are viewable by everyone" 
  ON submissions FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can create submissions" 
  ON submissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update their own submissions" 
  ON submissions FOR UPDATE USING (auth.uid() = user_id);

-- Comments: anyone can read, only authenticated users can create
CREATE POLICY IF NOT EXISTS "Comments are viewable by everyone" 
  ON comments FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can create comments" 
  ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update their own comments" 
  ON comments FOR UPDATE USING (auth.uid() = user_id);

-- Comment likes: anyone can read, only authenticated users can create/delete
CREATE POLICY IF NOT EXISTS "Comment likes are viewable by everyone" 
  ON comment_likes FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can like comments" 
  ON comment_likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can remove their own likes" 
  ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Submission ratings: anyone can read, only authenticated users can create/update
CREATE POLICY IF NOT EXISTS "Submission ratings are viewable by everyone" 
  ON submission_ratings FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can rate submissions" 
  ON submission_ratings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update their own ratings" 
  ON submission_ratings FOR UPDATE USING (auth.uid() = user_id);

-- Submission comments: anyone can read, only authenticated users can create
CREATE POLICY IF NOT EXISTS "Submission comments are viewable by everyone" 
  ON submission_comments FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can comment on submissions" 
  ON submission_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update their own submission comments" 
  ON submission_comments FOR UPDATE USING (auth.uid() = user_id);

-- Insert some sample challenges
INSERT INTO challenges (title, description, long_description, difficulty, frequency, tags, companies)
VALUES 
  (
    'E-commerce Product Page Redesign',
    'E-commerce websites often struggle with product pages that fail to effectively showcase products and drive conversions. Your challenge is to redesign a product page for an e-commerce website to improve user experience and increase conversion rates.',
    'The redesigned page should effectively display product information, images, pricing, and related products while guiding users toward making a purchase decision.',
    'easy',
    'high',
    '["UI Design", "E-commerce", "Web"]',
    '["Airbnb", "Uber", "Spotify", "Amazon", "Google", "Facebook"]'
  ),
  (
    'Mobile Banking App Dashboard',
    'Design a dashboard for a mobile banking application that displays account information, recent transactions, and financial insights.',
    'The dashboard should provide users with a clear overview of their financial status and make it easy to access common banking features.',
    'medium',
    'high',
    '["Mobile", "Finance", "Dashboard"]',
    '["Chase", "PayPal", "Square", "Stripe"]'
  ),
  (
    'SaaS Analytics Dashboard',
    'Create a comprehensive analytics dashboard for a SaaS platform that visualizes user engagement, revenue metrics, and feature usage.',
    'The dashboard should help SaaS companies understand their key performance indicators and make data-driven decisions.',
    'hard',
    'medium',
    '["Dashboard", "Data Viz", "Web"]',
    '["Salesforce", "HubSpot", "Zendesk", "Slack"]'
  )
ON CONFLICT DO NOTHING; 