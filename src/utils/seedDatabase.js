import { supabase } from '../lib/supabase';

// Mock users data
const mockUsers = [
  { 
    id: 1, 
    full_name: 'Michael Chen', 
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg' 
  },
  { 
    id: 2, 
    full_name: 'Sarah Johnson', 
    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg' 
  },
  { 
    id: 3, 
    full_name: 'Emily Rodriguez', 
    avatar_url: 'https://randomuser.me/api/portraits/women/65.jpg' 
  },
  { 
    id: 4, 
    full_name: 'David Kim', 
    avatar_url: 'https://randomuser.me/api/portraits/men/46.jpg' 
  },
  { 
    id: 5, 
    full_name: 'Alex Thompson', 
    avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg' 
  },
  { 
    id: 6, 
    full_name: 'Jessica Lee', 
    avatar_url: 'https://randomuser.me/api/portraits/women/54.jpg' 
  }
];

// Mock submissions data
const mockSubmissions = [
  {
    challenge_id: 1,
    title: 'Modern E-commerce Design',
    description: 'A clean and modern e-commerce product page design with focus on product details and easy add-to-cart functionality.',
    preview_image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 1,
    title: 'Minimalist Product Showcase',
    description: 'A minimalist approach to e-commerce product pages with focus on typography and whitespace.',
    preview_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 2,
    title: 'Intuitive Banking Dashboard',
    description: 'A user-friendly mobile banking dashboard with focus on financial insights and quick actions.',
    preview_image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 2,
    title: 'Banking App Redesign',
    description: 'A modern redesign of a banking app with focus on security and ease of use.',
    preview_image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 3,
    title: 'Streamlined Checkout Experience',
    description: 'A simplified checkout flow for food delivery apps with focus on speed and convenience.',
    preview_image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 3,
    title: 'Food Delivery Checkout',
    description: 'An intuitive checkout process for food delivery with focus on address selection and payment methods.',
    preview_image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 4,
    title: 'Data-Driven Dashboard',
    description: 'A comprehensive analytics dashboard for SaaS platforms with focus on data visualization and insights.',
    preview_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 4,
    title: 'SaaS Analytics Platform',
    description: 'A modern analytics platform for SaaS companies with focus on user behavior and conversion metrics.',
    preview_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 5,
    title: 'Travel Website Redesign',
    description: 'A modern redesign of a travel booking website with focus on destination discovery and booking process.',
    preview_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 5,
    title: 'Travel Booking Experience',
    description: 'A streamlined travel booking experience with focus on search filters and payment options.',
    preview_image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 6,
    title: 'Social Media Profile Redesign',
    description: 'A clean and modern social media profile page with focus on content showcase and user engagement.',
    preview_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  },
  {
    challenge_id: 6,
    title: 'Modern Social Profile',
    description: 'A modern social media profile design with focus on personal branding and content organization.',
    preview_image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    files: JSON.stringify({
      'design.fig': 'https://example.com/design.fig',
      'preview.jpg': 'https://example.com/preview.jpg'
    })
  }
];

/**
 * Seeds the database with mock submissions
 */
export const seedDatabase = async (userId) => {
  if (!userId) {
    console.error('User ID is required to seed the database');
    return { success: false, error: 'User ID is required' };
  }

  try {
    console.log('Starting database seeding...');
    
    // Insert submissions for the current user
    const submissionsToInsert = mockSubmissions.map(submission => ({
      ...submission,
      user_id: userId
    }));
    
    // Insert in batches of 3 to avoid rate limiting
    const batchSize = 3;
    for (let i = 0; i < submissionsToInsert.length; i += batchSize) {
      const batch = submissionsToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('submissions')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting submissions batch:', error);
        return { success: false, error };
      }
      
      // Add a small delay between batches
      if (i + batchSize < submissionsToInsert.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('Database seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
};

/**
 * Adds ratings to submissions
 */
export const addRatingsToSubmissions = async (userId) => {
  if (!userId) {
    console.error('User ID is required to add ratings');
    return { success: false, error: 'User ID is required' };
  }

  try {
    console.log('Starting to add ratings...');
    
    // Get all submissions
    const { data: submissions, error: fetchError } = await supabase
      .from('submissions')
      .select('id');
    
    if (fetchError) {
      console.error('Error fetching submissions:', fetchError);
      return { success: false, error: fetchError };
    }
    
    if (!submissions || submissions.length === 0) {
      console.log('No submissions found to rate');
      return { success: true, message: 'No submissions to rate' };
    }
    
    console.log(`Found ${submissions.length} submissions to rate`);
    
    // First, check if ratings already exist to avoid duplicate key violations
    const { data: existingRatings, error: checkError } = await supabase
      .from('submission_ratings')
      .select('submission_id, user_id')
      .eq('user_id', userId);
      
    if (checkError) {
      console.error('Error checking existing ratings:', checkError);
      return { success: false, error: checkError };
    }
    
    // Create a set of existing submission_id values that this user has already rated
    const alreadyRatedSubmissions = new Set();
    if (existingRatings && existingRatings.length > 0) {
      existingRatings.forEach(rating => {
        alreadyRatedSubmissions.add(rating.submission_id);
      });
    }
    
    console.log(`User has already rated ${alreadyRatedSubmissions.size} submissions`);
    
    // Create ratings for each submission that hasn't been rated yet
    const ratings = [];
    
    submissions.forEach(submission => {
      // Skip if this user has already rated this submission
      if (alreadyRatedSubmissions.has(submission.id)) {
        console.log(`Skipping submission ${submission.id} as user has already rated it`);
        return;
      }
      
      // Add one rating from the current user with a random rating between 3-5
      const rating = Math.floor(Math.random() * 3) + 3;
      ratings.push({
        submission_id: submission.id,
        user_id: userId,
        rating: rating
      });
    });
    
    if (ratings.length === 0) {
      console.log('No new ratings to add');
      return { success: true, message: 'All submissions already have ratings from this user' };
    }
    
    console.log(`Created ${ratings.length} ratings to insert`);
    
    // Insert ratings in batches
    const batchSize = 5;
    for (let i = 0; i < ratings.length; i += batchSize) {
      const batch = ratings.slice(i, i + batchSize);
      
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(ratings.length/batchSize)}`);
      
      const { error } = await supabase
        .from('submission_ratings')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting ratings batch:', error);
        return { success: false, error };
      }
      
      // Add a small delay between batches
      if (i + batchSize < ratings.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('Ratings added successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error adding ratings:', error);
    return { success: false, error };
  }
};

export default {
  seedDatabase,
  addRatingsToSubmissions
}; 