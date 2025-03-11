-- This script fixes storage bucket issues by:
-- 1. Ensuring the buckets exist and are public
-- 2. Checking and updating policies as needed

-- First, make sure the buckets exist and are public
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Check if the "Anyone can read submission files" policy exists
DO $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can read submission files'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Anyone can read submission files" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = ''submissions'')';
  END IF;
END $$;

-- Check if the "Anyone can read avatar files" policy exists
DO $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can read avatar files'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Create the policy if it doesn't exist
    EXECUTE 'CREATE POLICY "Anyone can read avatar files" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = ''avatars'')';
  END IF;
END $$;

-- List all available buckets for reference
SELECT id, name, public FROM storage.buckets;

-- List all storage policies for reference
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd 
FROM 
  pg_policies 
WHERE 
  schemaname = 'storage' 
  AND tablename = 'objects'; 