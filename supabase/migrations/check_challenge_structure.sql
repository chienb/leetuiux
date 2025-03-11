-- Check the structure of the challenges table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public'
  AND table_name = 'challenges'
ORDER BY 
  ordinal_position; 