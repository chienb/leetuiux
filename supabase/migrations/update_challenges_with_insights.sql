-- First, check if we need to add the new columns
DO $$
BEGIN
    -- Add insights column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'insights') THEN
        ALTER TABLE challenges ADD COLUMN insights JSONB;
    END IF;

    -- Add requirements column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'requirements') THEN
        ALTER TABLE challenges ADD COLUMN requirements JSONB;
    END IF;

    -- Add deliverables column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'deliverables') THEN
        ALTER TABLE challenges ADD COLUMN deliverables JSONB;
    END IF;

    -- Add resources column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'resources') THEN
        ALTER TABLE challenges ADD COLUMN resources JSONB;
    END IF;

    -- Add rating column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'rating') THEN
        ALTER TABLE challenges ADD COLUMN rating FLOAT;
    END IF;

    -- Add author column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'author') THEN
        ALTER TABLE challenges ADD COLUMN author TEXT;
    END IF;

    -- Add submissions_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'submissions_count') THEN
        ALTER TABLE challenges ADD COLUMN submissions_count INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Update the E-commerce Product Page Redesign challenge with insights and other data
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
    }'::jsonb,
    requirements = '[
        "Create a responsive product page design",
        "Include high-quality product images and information",
        "Design an intuitive navigation system",
        "Optimize the checkout process"
    ]'::jsonb,
    deliverables = '[
        "High-fidelity mockups of the product page",
        "Interactive prototype demonstrating key interactions",
        "Design system components used in the solution",
        "Brief explanation of design decisions"
    ]'::jsonb,
    resources = '[
        { "name": "E-commerce UX Best Practices", "link": "#" },
        { "name": "Product Page Design Examples", "link": "#" },
        { "name": "Conversion Rate Optimization Guide", "link": "#" }
    ]'::jsonb,
    rating = 4.2,
    author = 'Alex Morgan'
WHERE title = 'E-commerce Product Page Redesign';

-- Update the Mobile Banking App Dashboard challenge
UPDATE challenges
SET 
    insights = '{
        "interview_frequency": "high",
        "seen_in_interviews": { "yes": 38, "no": 12 },
        "last_reported": "1 week ago",
        "companies": [
            { "name": "Chase", "reports": 15 },
            { "name": "PayPal", "reports": 10 },
            { "name": "Square", "reports": 7 }
        ],
        "common_role": "UX Designer",
        "interview_stage": "Take-home (75%)"
    }'::jsonb,
    requirements = '[
        "Design a clean, intuitive dashboard layout",
        "Visualize account balances and transaction history",
        "Include quick access to common banking features",
        "Ensure security features are prominent"
    ]'::jsonb,
    deliverables = '[
        "High-fidelity mockups of the dashboard",
        "Interactive prototype showing key user flows",
        "Design system components",
        "Explanation of design decisions"
    ]'::jsonb,
    resources = '[
        { "name": "Financial App Design Patterns", "link": "#" },
        { "name": "Banking UX Best Practices", "link": "#" },
        { "name": "Data Visualization Guidelines", "link": "#" }
    ]'::jsonb,
    rating = 4.5,
    author = 'Sarah Johnson'
WHERE title = 'Mobile Banking App Dashboard';

-- Update the SaaS Analytics Dashboard challenge
UPDATE challenges
SET 
    insights = '{
        "interview_frequency": "medium",
        "seen_in_interviews": { "yes": 25, "no": 18 },
        "last_reported": "2 weeks ago",
        "companies": [
            { "name": "Salesforce", "reports": 9 },
            { "name": "HubSpot", "reports": 7 },
            { "name": "Zendesk", "reports": 5 }
        ],
        "common_role": "Product Designer",
        "interview_stage": "Take-home (60%)"
    }'::jsonb,
    requirements = '[
        "Design a comprehensive analytics dashboard",
        "Visualize key performance indicators",
        "Create intuitive data filtering options",
        "Ensure the design scales with increasing data"
    ]'::jsonb,
    deliverables = '[
        "High-fidelity mockups of the dashboard",
        "Interactive prototype demonstrating data interactions",
        "Design system components",
        "Documentation of design decisions"
    ]'::jsonb,
    resources = '[
        { "name": "Data Visualization Best Practices", "link": "#" },
        { "name": "SaaS Dashboard Examples", "link": "#" },
        { "name": "UX Patterns for Complex Data", "link": "#" }
    ]'::jsonb,
    rating = 4.7,
    author = 'Michael Chen'
WHERE title = 'SaaS Analytics Dashboard';

-- Update the remaining challenges with similar data structure
UPDATE challenges
SET 
    insights = '{
        "interview_frequency": "medium",
        "seen_in_interviews": { "yes": 20, "no": 15 },
        "last_reported": "3 weeks ago",
        "companies": [
            { "name": "Uber Eats", "reports": 8 },
            { "name": "DoorDash", "reports": 6 },
            { "name": "Grubhub", "reports": 4 }
        ],
        "common_role": "UX/UI Designer",
        "interview_stage": "Take-home (70%)"
    }'::jsonb,
    requirements = '[
        "Improve the food browsing experience",
        "Streamline the checkout process",
        "Enhance the delivery tracking interface",
        "Design for accessibility"
    ]'::jsonb,
    deliverables = '[
        "High-fidelity mockups of key screens",
        "Interactive prototype of the ordering flow",
        "Design system components",
        "Explanation of design decisions"
    ]'::jsonb,
    resources = '[
        { "name": "Food Delivery App UX Patterns", "link": "#" },
        { "name": "Mobile Checkout Best Practices", "link": "#" },
        { "name": "Accessibility Guidelines", "link": "#" }
    ]'::jsonb,
    rating = 4.0,
    author = 'Jessica Lee'
WHERE title = 'Food Delivery App Redesign';

-- Update all challenges to have a submissions count of 128
UPDATE challenges
SET 
    submissions_count = 128
WHERE submissions_count IS NULL OR submissions_count = 0; 