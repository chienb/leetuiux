-- Drop existing challenge policies
DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON challenges;
DROP POLICY IF EXISTS "Authenticated users can create challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON challenges;

-- Recreate challenge policies
CREATE POLICY "Challenges are viewable by everyone" 
  ON challenges FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create challenges" 
  ON challenges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own challenges" 
  ON challenges FOR UPDATE USING (auth.uid() = user_id); 