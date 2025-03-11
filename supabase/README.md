# Supabase Database Setup

This directory contains SQL migrations for setting up the Supabase database for the LeetUIUX application.

## Database Schema

The main tables in the database are:

- `challenges`: Stores UI/UX design challenges
- `submissions`: Stores user submissions for challenges
- `submission_ratings`: Stores ratings for submissions

## Running Migrations

You can run the migrations in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of the migration file you want to run
5. Click "Run" to execute the SQL

## Required Tables

For the application to work properly, you need to ensure the following tables exist:

### challenges

```sql
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
```

### submissions

```sql
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
```

### submission_ratings

```sql
CREATE TABLE IF NOT EXISTS submission_ratings (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);
```

## Creating the submission_ratings Table

If you're getting errors related to the submission_ratings table, you can run the `add_submission_ratings.sql` migration to create it:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `add_submission_ratings.sql`
5. Click "Run" to execute the SQL

### Troubleshooting SQL Syntax Errors

If you encounter a syntax error like:

```
ERROR: 42601: syntax error at or near "NOT"
LINE 29: CREATE POLICY IF NOT EXISTS "Submission ratings are viewable by everyone"
```

This is because some PostgreSQL versions in Supabase don't support the `IF NOT EXISTS` clause for policies. The updated `add_submission_ratings.sql` file addresses this by:

1. First dropping any existing policies with `DROP POLICY IF EXISTS`
2. Then creating new policies without the `IF NOT EXISTS` clause

If you're still encountering issues, you can try running these statements separately:

```sql
-- First create the table
CREATE TABLE IF NOT EXISTS submission_ratings (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);

-- Then create the view
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

-- Enable RLS
ALTER TABLE submission_ratings ENABLE ROW LEVEL SECURITY;

-- Then add policies one by one
-- If a policy already exists, you'll get an error, but you can ignore it
CREATE POLICY "Submission ratings are viewable by everyone" 
  ON submission_ratings FOR SELECT USING (true);
```

## Seeding the Database

You can seed the database with mock data using the "Seed Database" button on the Profile page of the application. This will:

1. Add mock submissions for each challenge
2. Add ratings to the submissions (if the submission_ratings table exists)

All mock submissions will be associated with your user account.

## Tables

The application uses the following tables:

1. `challenges` - Stores design challenges
2. `submissions` - Stores user submissions for challenges
3. `comments` - Stores comments on challenges
4. `comment_likes` - Stores likes on comments
5. `submission_ratings` - Stores ratings for submissions
6. `submission_comments` - Stores comments on submissions

## Setup Instructions

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to the SQL Editor
4. Copy the contents of `migrations/create_tables.sql`
5. Paste into the SQL Editor and run the script

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

## Row Level Security (RLS)

The SQL scripts include Row Level Security policies to ensure data security:

- Anyone can view challenges, submissions, comments, and ratings
- Only authenticated users can create new records
- Users can only update or delete their own records

## Views

The database includes the following views for easier querying:

1. `comments_with_likes` - Comments with their like counts
2. `submissions_with_ratings` - Submissions with their average ratings

## Sample Data

The scripts include sample challenge data to get you started.

## Troubleshooting

If you encounter any issues with the database setup:

1. Check that your Supabase project is properly configured
2. Ensure that the SQL scripts are executed in the correct order
3. Verify that your application's `.env` file contains the correct Supabase URL and anon key

### Common Errors

#### Policy Already Exists

If you see an error like `ERROR: 42710: policy "Challenges are viewable by everyone" for table "challenges" already exists`, it means you're trying to create policies that already exist. You have two options:

1. **Run the fix_policies.sql script**: This script will drop existing policies and recreate them.
   ```sql
   -- Run this in the SQL Editor
   DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON challenges;
   -- ... and so on for other policies
   ```

2. **Check existing tables and policies**: Run the `check_tables.sql` script to see what tables and policies already exist in your database.

#### Column Does Not Exist

If you see an error like `ERROR: 42703: column "created_by" does not exist`, it means the table structure in your database doesn't match what the script is expecting. You have two options:

1. **Run the add_user_id_column.sql script**: This script will add the missing column to the table.
   ```sql
   -- Run this in the SQL Editor
   ALTER TABLE challenges ADD COLUMN user_id UUID REFERENCES auth.users(id);
   ```

2. **Check the table structure**: Run the `check_challenge_structure.sql` script to see the current structure of the challenges table.

#### Tables Don't Exist

If you see an error about tables not existing, make sure you've run the `create_tables.sql` script first. You can check if tables exist by running:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

#### Missing Sample Challenges

If your sample challenges are missing from the database, you can restore them by running the `insert_sample_challenges.sql` script:

```sql
-- Run this in the SQL Editor
INSERT INTO challenges (title, description, long_description, difficulty, frequency, tags, companies)
VALUES 
  (
    'E-commerce Product Page Redesign',
    'E-commerce websites often struggle with product pages...',
    -- ... and so on
  );
```

You can check if there are any challenges in the database by running:

```sql
SELECT id, title FROM challenges;
```

#### Missing Columns

If you see an error like `ERROR: 42703: column "frequency" does not exist`, it means your challenges table is missing some columns. You have two options:

1. **Add the missing columns**: Run the `add_missing_columns.sql` script to add the missing columns to the existing table:
   ```sql
   -- Run this in the SQL Editor
   DO $$
   BEGIN
     -- Add frequency column if it doesn't exist
     IF NOT EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'challenges'
         AND column_name = 'frequency'
     ) THEN
       ALTER TABLE challenges ADD COLUMN frequency TEXT;
     END IF;
     
     -- ... and so on for other columns
   END $$;
   ```

2. **Recreate the challenges table**: If you're having multiple issues with the challenges table, you can recreate it from scratch using the `recreate_challenges_table.sql` script. This will:
   - Backup your existing challenges (if any)
   - Drop and recreate the challenges table with all required columns
   - Add sample challenges

   Note that this will reset any existing challenges data, so only use this option if you're okay with losing that data.

You can check the current structure of the challenges table by running:

```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'challenges';
```

#### Adding Company Insights and Challenge Details

If you need to add company insights, requirements, deliverables, resources, ratings, and author information to your challenges, you can run the `update_challenges_with_insights.sql` script:

```sql
-- Run this in the SQL Editor
DO $$
BEGIN
    -- Add insights column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'insights') THEN
        ALTER TABLE challenges ADD COLUMN insights JSONB;
    END IF;
    
    -- ... and so on for other columns
END
$$;

-- Then update the challenges with insights data
UPDATE challenges
SET 
    insights = '{
        "interview_frequency": "high",
        "seen_in_interviews": { "yes": 42, "no": 15 },
        "last_reported": "2 days ago",
        "companies": [
            { "name": "Airbnb", "reports": 12 },
            { "name": "Uber", "reports": 8 },
            { "name": "Spotify", "reports": 6 }
        ],
        "common_role": "Senior Product Designer",
        "interview_stage": "Take-home (85%)"
    }'::jsonb
WHERE title = 'E-commerce Product Page Redesign';
```

This script will:
1. Add new columns to the challenges table if they don't exist
2. Update the challenges with company insights data, requirements, deliverables, resources, ratings, and author information
3. Set a submissions count for all challenges

After running this script, your challenges will have the complete data structure needed for the UI shown in the mockups. 

#### Updating the Submissions Table

If you need to update the submissions table to support the enhanced submission form with Figma embeds and file uploads, you can run the `update_submissions_table.sql` script:

```sql
-- Run this in the SQL Editor
DO $$
BEGIN
    -- Add tools column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'tools') THEN
        ALTER TABLE submissions ADD COLUMN tools TEXT;
    END IF;

    -- Add figma_embed column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'figma_embed') THEN
        ALTER TABLE submissions ADD COLUMN figma_embed TEXT;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'status') THEN
        ALTER TABLE submissions ADD COLUMN status TEXT DEFAULT 'submitted';
    END IF;
    
    -- Add files column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'files') THEN
        ALTER TABLE submissions ADD COLUMN files JSONB DEFAULT '[]'::jsonb;
    END IF;
END
$$;
```

This script will:
1. Add new columns to the submissions table if they don't exist
2. Ensure the files column is of the correct type (JSONB)

After running this script, your submissions table will support:
- Tools used in the submission (e.g., Figma, Sketch)
- Figma embed codes for interactive previews
- Submission status tracking
- Structured file metadata storage

You'll also need to set up a storage bucket named "submissions" in your Supabase project to store the uploaded files. The application will organize files into two folders:
- `preview-images/` - For the main preview images
- `project-files/` - For all other project files

#### Setting Up Storage for Submissions

To set up the storage bucket and necessary policies for file uploads, run the `create_storage_buckets.sql` script:

```sql
-- Run this in the SQL Editor
-- Create a storage bucket for submissions if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the submissions bucket
CREATE POLICY "Users can upload their own submission files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'submissions' AND
  (auth.uid()::text = (storage.foldername(name))[2])
);

-- ... and other policies
```

This script will:
1. Create a storage bucket named "submissions" if it doesn't exist
2. Set up policies to allow:
   - Authenticated users to upload files to their own folder
   - Authenticated users to update and delete their own files
   - Anyone to read submission files

After running this script, your Supabase project will be properly configured to handle file uploads for challenge submissions.

#### Creating the Submissions Table

If the submissions table doesn't exist or you're encountering errors related to missing columns, you can run the `create_submissions_table.sql` script to create the table with all the necessary columns:

```sql
-- Run this in the SQL Editor
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

-- ... and other policies
```

This script will:
1. Create the submissions table with all the necessary columns
2. Set up appropriate references to the challenges and users tables
3. Enable Row Level Security (RLS) on the table
4. Create policies to control access to the table

#### Checking the Submissions Table Structure

If you're encountering errors related to the submissions table structure, you can run the `check_submissions_structure.sql` script to check the current structure of the table:

```sql
-- Run this in the SQL Editor
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'submissions'
ORDER BY 
    ordinal_position;
```

This will show you all the columns in the submissions table, their data types, and whether they can be null. You can use this information to identify any missing or incorrectly configured columns. 

### Simplified SQL File

If you're still encountering issues with the SQL syntax, we've provided a simplified version of the file that only creates the table and view without the policies:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `simple_add_ratings.sql`
5. Click "Run" to execute the SQL

This will create the necessary table and view without adding any policies. If you need policies later, you can add them one by one as shown in the comments of the file. 

## Creating the profiles Table

If you're getting errors related to the profiles table not existing, you can run the `create_profiles_table.sql` migration to create it:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `create_profiles_table.sql`
5. Click "Run" to execute the SQL

This will create a profiles table that stores user profile information and automatically creates a profile when a new user signs up. The table includes:

- `id`: The user's UUID (linked to auth.users)
- `full_name`: The user's full name
- `avatar_url`: The URL to the user's avatar image
- `title`: The user's job title
- `bio`: The user's biography

It also sets up appropriate RLS policies and a trigger to automatically create a profile when a user signs up. 

# Supabase Setup Instructions

This document provides instructions for setting up your Supabase project for the LeetDesign application.

## Storage Buckets

The application requires the following storage buckets:

1. `submissions` - For storing submission files and preview images
2. `avatars` - For storing user avatar images

### Setting Up Storage Buckets

You can set up the storage buckets in two ways:

#### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the Storage section
3. Click "Create a new bucket"
4. Create a bucket named "submissions" and set it to public
5. Create a bucket named "avatars" and set it to public
6. Set up the appropriate bucket policies (see below)

#### Option 2: Using SQL Migrations

Run the following SQL script in the SQL Editor of your Supabase project:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the submissions bucket
CREATE POLICY "Anyone can read submission files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'submissions');

-- Set up storage policies for the avatars bucket
CREATE POLICY "Anyone can read avatar files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'avatars');
```

Alternatively, you can run the full migration script:

```bash
npx supabase migration up
```

## Troubleshooting

### "Bucket not found" Error

If you encounter a "Bucket not found" error:

1. Check that the buckets exist in your Supabase project
2. Make sure the buckets are set to public
3. Verify that the bucket policies allow the appropriate access

### Image Loading Issues

If images are not loading:

1. Check the browser console for errors
2. Verify that the URLs are correctly formatted
3. Make sure the bucket policies allow public access to the files

## Additional Resources

- [Supabase Storage Documentation](https://supabase.io/docs/guides/storage)
- [Supabase Storage Policies](https://supabase.io/docs/guides/storage/security) 