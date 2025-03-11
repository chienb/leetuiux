-- Add missing columns to the challenges table
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

  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'challenges'
      AND column_name = 'tags'
  ) THEN
    ALTER TABLE challenges ADD COLUMN tags JSONB;
  END IF;

  -- Add companies column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'challenges'
      AND column_name = 'companies'
  ) THEN
    ALTER TABLE challenges ADD COLUMN companies JSONB;
  END IF;

  -- Add long_description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'challenges'
      AND column_name = 'long_description'
  ) THEN
    ALTER TABLE challenges ADD COLUMN long_description TEXT;
  END IF;

  -- Add difficulty column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'challenges'
      AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE challenges ADD COLUMN difficulty TEXT;
  END IF;
END $$; 