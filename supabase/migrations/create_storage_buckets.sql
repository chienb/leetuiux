-- Create a storage bucket for submissions if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Create a storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid "policy already exists" errors
DROP POLICY IF EXISTS "Users can upload their own submission files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own submission files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own submission files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read submission files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read avatar files" ON storage.objects;

-- Set up storage policies for the submissions bucket

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload their own submission files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'submissions' AND
  (auth.uid()::text = (storage.foldername(name))[2])
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own submission files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'submissions' AND
  (auth.uid()::text = (storage.foldername(name))[2])
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own submission files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'submissions' AND
  (auth.uid()::text = (storage.foldername(name))[2])
);

-- Allow anyone to read submission files
CREATE POLICY "Anyone can read submission files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'submissions'
);

-- Set up storage policies for the avatars bucket

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (auth.uid()::text = (storage.foldername(name))[1])
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (auth.uid()::text = (storage.foldername(name))[1])
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (auth.uid()::text = (storage.foldername(name))[1])
);

-- Allow anyone to read avatar files
CREATE POLICY "Anyone can read avatar files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'avatars'
); 