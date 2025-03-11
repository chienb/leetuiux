-- Add files column to the submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]'::jsonb; 