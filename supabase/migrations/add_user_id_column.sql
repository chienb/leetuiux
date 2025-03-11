-- Check if user_id column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'challenges'
      AND column_name = 'user_id'
  ) THEN
    -- Add user_id column
    ALTER TABLE challenges ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$; 