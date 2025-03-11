import { supabase } from './supabase';

// Comments
export const createComment = async (commentData) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          challenge_id: commentData.challengeId,
          user_id: commentData.userId,
          text: commentData.text,
          created_at: new Date().toISOString(),
        }
      ])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, error };
  }
};

export const getCommentsByChallengeId = async (challengeId) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, error };
  }
};

export const likeComment = async (commentId, userId) => {
  try {
    // First check if the user has already liked this comment
    const { data: existingLike, error: checkError } = await supabase
      .from('comment_likes')
      .select()
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if user hasn't liked yet
      throw checkError;
    }
    
    if (existingLike) {
      // User already liked, so unlike
      const { error: unlikeError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);
      
      if (unlikeError) throw unlikeError;
      return { success: true, action: 'unliked' };
    } else {
      // User hasn't liked, so add like
      const { error: likeError } = await supabase
        .from('comment_likes')
        .insert([
          {
            comment_id: commentId,
            user_id: userId,
            created_at: new Date().toISOString(),
          }
        ]);
      
      if (likeError) throw likeError;
      return { success: true, action: 'liked' };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error };
  }
};

// Submissions
export const createSubmission = async (submissionData) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          challenge_id: submissionData.challengeId,
          user_id: submissionData.userId,
          title: submissionData.title,
          description: submissionData.description,
          tools: submissionData.tools,
          preview_image: submissionData.previewImage,
          figma_embed: submissionData.figmaEmbed,
          files: submissionData.files,
          created_at: new Date().toISOString(),
          status: submissionData.status || 'submitted'
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating submission:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error creating submission:', error);
    return { success: false, error };
  }
};

export const getSubmissionsByChallengeId = async (challengeId) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error };
  }
};

export const getSubmissionsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        challenge:challenge_id (
          id,
          title,
          difficulty
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return { success: false, error };
  }
};

export const getSubmissionById = async (submissionId) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        ),
        challenge:challenge_id (
          id,
          title,
          difficulty
        )
      `)
      .eq('id', submissionId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching submission:', error);
    return { success: false, error };
  }
};

// Challenges
export const getAllChallenges = async () => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Check if data is null or empty
    if (!data || data.length === 0) {
      console.log('No challenges found');
      return { success: false, error: 'No challenges found' };
    }
    
    // Ensure all challenges have required fields with default values
    const challenges = data.map(challenge => ({
      id: challenge.id,
      title: challenge.title || 'Untitled Challenge',
      description: challenge.description || 'No description available',
      long_description: challenge.long_description || challenge.description || 'No detailed description available',
      difficulty: challenge.difficulty || 'easy',
      frequency: challenge.frequency || 'medium',
      created_at: challenge.created_at || new Date().toISOString(),
      tags: challenge.tags || [],
      companies: challenge.companies || [],
      deliverables: challenge.deliverables || [],
      resources: challenge.resources || [],
      requirements: challenge.requirements || [],
      insights: challenge.insights || {
        interview_frequency: 'medium',
        seen_in_interviews: { yes: 0, no: 0 },
        last_reported: 'N/A',
        companies: [],
        common_role: 'UI/UX Designer',
        interview_stage: 'Take-home'
      },
      submissions: challenge.submissions_count || 0,
      rating: challenge.rating || 0,
      author: challenge.author || 'Unknown'
    }));
    
    return { success: true, data: challenges };
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return { success: false, error: error.message };
  }
};

export const getChallengeById = async (challengeId) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means no rows returned
        console.log(`No challenge found with ID ${challengeId}`);
        return { success: false, error: 'Challenge not found' };
      }
      throw error;
    }
    
    // Check if data is null or undefined
    if (!data) {
      console.log(`No challenge data returned for ID ${challengeId}`);
      return { success: false, error: 'No challenge data returned' };
    }
    
    // Ensure all required fields have default values
    const challenge = {
      id: data.id,
      title: data.title || 'Untitled Challenge',
      description: data.description || 'No description available',
      long_description: data.long_description || data.description || 'No detailed description available',
      difficulty: data.difficulty || 'easy',
      frequency: data.frequency || 'medium',
      created_at: data.created_at || new Date().toISOString(),
      tags: data.tags || [],
      companies: data.companies || [],
      deliverables: data.deliverables || [],
      resources: data.resources || [],
      requirements: data.requirements || [],
      insights: data.insights || {
        interview_frequency: 'medium',
        seen_in_interviews: { yes: 0, no: 0 },
        last_reported: 'N/A',
        companies: [],
        common_role: 'UI/UX Designer',
        interview_stage: 'Take-home'
      },
      submissions: data.submissions_count || 0,
      rating: data.rating || 0,
      author: data.author || 'Unknown'
    };
    
    return { success: true, data: challenge };
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return { success: false, error: error.message };
  }
};

export const createChallenge = async (challengeData) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .insert([
        {
          title: challengeData.title,
          description: challengeData.description,
          long_description: challengeData.longDescription,
          difficulty: challengeData.difficulty,
          frequency: challengeData.frequency,
          tags: challengeData.tags,
          companies: challengeData.companies,
          user_id: challengeData.userId
        }
      ])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating challenge:', error);
    return { success: false, error };
  }
}; 