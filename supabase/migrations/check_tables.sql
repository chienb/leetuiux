-- Check if tables exist
SELECT 
  table_name,
  'exists' as status
FROM 
  information_schema.tables
WHERE 
  table_schema = 'public'
  AND table_name IN (
    'challenges',
    'submissions',
    'comments',
    'comment_likes',
    'submission_ratings',
    'submission_comments'
  );

-- Check if views exist
SELECT 
  table_name,
  'exists' as status
FROM 
  information_schema.views
WHERE 
  table_schema = 'public'
  AND table_name IN (
    'comments_with_likes',
    'submissions_with_ratings'
  );

-- Check if policies exist
SELECT 
  policyname,
  tablename,
  'exists' as status
FROM 
  pg_policies
WHERE 
  schemaname = 'public'
ORDER BY 
  tablename, policyname; 