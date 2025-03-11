-- Check if there are any challenges in the database
SELECT 
  id, 
  title, 
  description,
  created_at
FROM 
  challenges
ORDER BY 
  id; 