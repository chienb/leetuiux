-- Create the submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES challenges(id),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  tools TEXT,
  preview_image TEXT,
  figma_embed TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'submitted'
);

-- Enable RLS on the submissions table
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for the submissions table
CREATE POLICY "Submissions are viewable by everyone" 
  ON submissions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create submissions" 
  ON submissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own submissions" 
  ON submissions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" 
  ON submissions FOR DELETE USING (auth.uid() = user_id); 