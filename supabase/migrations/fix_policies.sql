-- Drop existing policies
DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON challenges;
DROP POLICY IF EXISTS "Authenticated users can create challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON challenges;

DROP POLICY IF EXISTS "Submissions are viewable by everyone" ON submissions;
DROP POLICY IF EXISTS "Authenticated users can create submissions" ON submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON submissions;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;

DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON comment_likes;
DROP POLICY IF EXISTS "Authenticated users can like comments" ON comment_likes;
DROP POLICY IF EXISTS "Users can remove their own likes" ON comment_likes;

DROP POLICY IF EXISTS "Submission ratings are viewable by everyone" ON submission_ratings;
DROP POLICY IF EXISTS "Authenticated users can rate submissions" ON submission_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON submission_ratings;

DROP POLICY IF EXISTS "Submission comments are viewable by everyone" ON submission_comments;
DROP POLICY IF EXISTS "Authenticated users can comment on submissions" ON submission_comments;
DROP POLICY IF EXISTS "Users can update their own submission comments" ON submission_comments;

-- Recreate policies
-- Challenges: anyone can read, only authenticated users can create
CREATE POLICY "Challenges are viewable by everyone" 
  ON challenges FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create challenges" 
  ON challenges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own challenges" 
  ON challenges FOR UPDATE USING (auth.uid() = user_id);

-- Submissions: anyone can read, only authenticated users can create
CREATE POLICY "Submissions are viewable by everyone" 
  ON submissions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create submissions" 
  ON submissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own submissions" 
  ON submissions FOR UPDATE USING (auth.uid() = user_id);

-- Comments: anyone can read, only authenticated users can create
CREATE POLICY "Comments are viewable by everyone" 
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" 
  ON comments FOR UPDATE USING (auth.uid() = user_id);

-- Comment likes: anyone can read, only authenticated users can create/delete
CREATE POLICY "Comment likes are viewable by everyone" 
  ON comment_likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like comments" 
  ON comment_likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can remove their own likes" 
  ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Submission ratings: anyone can read, only authenticated users can create/update
CREATE POLICY "Submission ratings are viewable by everyone" 
  ON submission_ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rate submissions" 
  ON submission_ratings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own ratings" 
  ON submission_ratings FOR UPDATE USING (auth.uid() = user_id);

-- Submission comments: anyone can read, only authenticated users can create
CREATE POLICY "Submission comments are viewable by everyone" 
  ON submission_comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment on submissions" 
  ON submission_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own submission comments" 
  ON submission_comments FOR UPDATE USING (auth.uid() = user_id); 