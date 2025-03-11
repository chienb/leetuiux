-- Backup existing challenges
CREATE TABLE IF NOT EXISTS challenges_backup AS
SELECT * FROM challenges;

-- Drop existing challenges table
DROP TABLE IF EXISTS challenges CASCADE;

-- Recreate challenges table with all required columns
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  difficulty TEXT,
  frequency TEXT,
  tags JSONB,
  companies JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on the new table
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Challenges are viewable by everyone" 
  ON challenges FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create challenges" 
  ON challenges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own challenges" 
  ON challenges FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample challenges
INSERT INTO challenges (title, description, long_description, difficulty, frequency, tags, companies)
VALUES 
  (
    'E-commerce Product Page Redesign',
    'E-commerce websites often struggle with product pages that fail to effectively showcase products and drive conversions. Your challenge is to redesign a product page for an e-commerce website to improve user experience and increase conversion rates.',
    'The redesigned page should effectively display product information, images, pricing, and related products while guiding users toward making a purchase decision.',
    'easy',
    'high',
    '["UI Design", "E-commerce", "Web"]',
    '["Airbnb", "Uber", "Spotify", "Amazon", "Google", "Facebook"]'
  ),
  (
    'Mobile Banking App Dashboard',
    'Design a dashboard for a mobile banking application that displays account information, recent transactions, and financial insights.',
    'The dashboard should provide users with a clear overview of their financial status and make it easy to access common banking features.',
    'medium',
    'high',
    '["Mobile", "Finance", "Dashboard"]',
    '["Chase", "PayPal", "Square", "Stripe"]'
  ),
  (
    'SaaS Analytics Dashboard',
    'Create a comprehensive analytics dashboard for a SaaS platform that visualizes user engagement, revenue metrics, and feature usage.',
    'The dashboard should help SaaS companies understand their key performance indicators and make data-driven decisions.',
    'hard',
    'medium',
    '["Dashboard", "Data Viz", "Web"]',
    '["Salesforce", "HubSpot", "Zendesk", "Slack"]'
  ),
  (
    'Food Delivery App Redesign',
    'Redesign a food delivery app to improve the ordering process and enhance the overall user experience.',
    'Focus on making the food browsing, selection, and checkout process more intuitive and efficient.',
    'easy',
    'medium',
    '["Mobile", "Food", "E-commerce"]',
    '["Uber Eats", "DoorDash", "Grubhub", "Deliveroo"]'
  ),
  (
    'Fitness Tracker App',
    'Design a fitness tracking app that helps users monitor their workouts, set goals, and track their progress over time.',
    'The app should provide clear visualizations of fitness data and motivate users to maintain their exercise routines.',
    'medium',
    'medium',
    '["Mobile", "Health", "Data Viz"]',
    '["Fitbit", "Nike", "Under Armour", "Peloton"]'
  ),
  (
    'Smart Home Control Interface',
    'Create an intuitive interface for controlling smart home devices, including lighting, temperature, security, and entertainment systems.',
    'The interface should be accessible to users of all technical abilities and provide quick access to commonly used functions.',
    'hard',
    'low',
    '["IoT", "Dashboard", "Mobile"]',
    '["Google", "Amazon", "Apple", "Samsung"]'
  ); 