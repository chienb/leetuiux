-- Check if we need to add new columns to the submissions table
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

    -- Add files column if it doesn't exist or make sure it's JSONB
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'files') THEN
        ALTER TABLE submissions ADD COLUMN files JSONB DEFAULT '[]'::jsonb;
    ELSIF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'submissions'
        AND column_name = 'files'
        AND data_type != 'jsonb'
    ) THEN
        ALTER TABLE submissions ALTER COLUMN files TYPE JSONB USING files::jsonb;
    END IF;
END
$$; 