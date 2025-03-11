import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, getSignedUrl, getPublicUrl } from '../lib/supabase';

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [submitter, setSubmitter] = useState(null);
  const [error, setError] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [availableBuckets, setAvailableBuckets] = useState([]);
  const [figmaPreviewUrl, setFigmaPreviewUrl] = useState('');
  
  // Fetch available buckets on component mount
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error('Error fetching buckets:', error);
          return;
        }
        
        if (buckets && buckets.length > 0) {
          const bucketNames = buckets.map(bucket => bucket.name);
          console.log('Available buckets:', bucketNames);
          setAvailableBuckets(bucketNames);
        } else {
          console.warn('No storage buckets found in your Supabase project');
        }
      } catch (error) {
        console.error('Error fetching buckets:', error);
      }
    };
    
    fetchBuckets();
  }, []);

  // Function to validate and fix image URLs
  const getValidImageUrl = async (imageUrl) => {
    if (!imageUrl) return 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview';
    
    console.log('Original image URL:', imageUrl);
    
    // Handle blob URLs (for local previews)
    if (imageUrl.startsWith('blob:')) {
      return imageUrl;
    }
    
    // Check if the URL is a public URL that needs to be converted to a signed URL
    if (imageUrl.includes('/storage/v1/object/public/')) {
      try {
        // Extract the path from the public URL
        const pathMatch = imageUrl.match(/\/storage\/v1\/object\/public\/submissions\/(.+)/);
        if (pathMatch && pathMatch[1]) {
          const objectPath = pathMatch[1];
          
          // Try to get a signed URL
          const signedUrl = await getSignedUrl('submissions', objectPath, 3600);
          if (signedUrl) {
            console.log('Created signed URL:', signedUrl);
            return signedUrl;
          }
          
          // If signed URL fails, try to use the direct URL
          console.log('Falling back to direct URL');
          return imageUrl;
        }
      } catch (error) {
        console.error('Error creating signed URL:', error);
      }
    }
    
    // Just return the original URL without any processing
    return imageUrl;
  };

  // Extract Figma URL from embed code
  const extractFigmaUrl = (embedCode) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(embedCode, 'text/html');
      const iframe = doc.querySelector('iframe');
      return iframe?.src || '';
    } catch (error) {
      console.error('Error parsing Figma embed code:', error);
      return '';
    }
  };

  // Fetch submission data from Supabase
  useEffect(() => {
    const fetchSubmissionData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch submission data
        const { data: submissionData, error: submissionError } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', id)
          .single();
        
        if (submissionError || !submissionData) {
          throw new Error(submissionError?.message || 'Submission not found');
        }
        
        console.log('Submission data:', submissionData);
        
        // Fetch challenge data
        let challengeData = {};
        try {
          const { data: challengeResult, error: challengeError } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', submissionData.challenge_id)
            .single();
          
          if (!challengeError && challengeResult) {
            challengeData = challengeResult;
            setChallenge(challengeResult);
          }
        } catch (error) {
          console.warn('Error fetching challenge data:', error);
        }
        
        // Fetch user profile
        let userProfile = {};
        try {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', submissionData.user_id)
            .single();
          
          // If user profile doesn't exist, use default values
          if (userError || !userData) {
            console.warn('User profile not found, using default values');
            userProfile = {
              id: submissionData.user_id,
              full_name: 'User',
              avatar_url: `https://ui-avatars.com/api/?name=User&background=random`,
              title: 'Designer'
            };
          } else {
            userProfile = userData;
            setSubmitter(userData);
          }
        } catch (error) {
          console.warn('Error fetching user profile, using default values:', error);
          userProfile = {
            id: submissionData.user_id,
            full_name: 'User',
            avatar_url: `https://ui-avatars.com/api/?name=User&background=random`,
            title: 'Designer'
          };
        }
        
        // Fetch ratings
        let avgRating = 0;
        try {
          const { data: ratingsData, error: ratingsError } = await supabase
            .from('submission_ratings')
            .select('rating')
            .eq('submission_id', id);
          
          if (!ratingsError && ratingsData && ratingsData.length > 0) {
            const sum = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
            avgRating = sum / ratingsData.length;
          }
        } catch (error) {
          console.warn('Error fetching ratings, using default value:', error);
        }
        
        // Format the submission data
        const formattedSubmission = {
          id: submissionData.id,
          title: submissionData.title || challengeData.title,
          image: submissionData.preview_image || 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview',
          description: submissionData.description || 'No description provided.',
          figma_embed: submissionData.figma_embed || null,
          user: {
            name: userProfile.full_name,
            avatar: userProfile.avatar_url,
            title: userProfile.title || 'Designer',
          },
          challenge: {
            id: challengeData.id,
            title: challengeData.title,
            difficulty: challengeData.difficulty || 'medium',
          },
          date: formatDate(submissionData.created_at),
          rating: avgRating,
          comments: [
            {
              id: 1,
              user: {
                name: 'Sarah Johnson',
                avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
              },
              text: 'Great work on the product layout! The image gallery is particularly well done. Have you considered adding a quick view feature for the related products?',
              date: '2 hours ago',
              likes: 5,
            },
            {
              id: 2,
              user: {
                name: 'David Wilson',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
              },
              text: 'The attention to detail in the typography and spacing is impressive. This would definitely help improve conversion rates.',
              date: '1 day ago',
              likes: 3,
            },
          ],
        };
        
        // Process the image URL
        const validImageUrl = await getValidImageUrl(formattedSubmission.image);
        formattedSubmission.image = validImageUrl;

        // Extract Figma URL if embed code exists
        if (formattedSubmission.figma_embed) {
          const figmaUrl = extractFigmaUrl(formattedSubmission.figma_embed);
          setFigmaPreviewUrl(figmaUrl);
        }

        setSubmission(formattedSubmission);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submission data:', error);
        setError('Failed to load submission. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmissionData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="half-fill" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="none" />
              </linearGradient>
            </defs>
            <path fill="url(#half-fill)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            <path fill="none" stroke="currentColor" strokeWidth="1" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
          </svg>
        );
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p>Submission not found.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link to={`/challenge-detail/${submission.challenge.id}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          Back to Challenge
        </Link>
      </div>

      {/* Submission Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{submission.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={submission.user.avatar} alt={submission.user.name} className="h-8 w-8 rounded-full" />
                <span className="text-sm text-gray-600">by {submission.user.name}</span>
              </div>
              <span className="text-sm text-gray-500">Submitted {submission.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v12"></path>
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
              </svg>
              Like
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Comment
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preview Image */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <img 
              src={submission.image} 
              alt="Submission preview" 
              className="w-full aspect-video object-cover"
              onError={(e) => {
                console.error('Image failed to load:', submission.image);
                e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview';
              }}
            />
          </div>

          {/* Figma Preview */}
          {submission.figma_embed && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Figma Preview</h2>
              <div className="aspect-[16/9] bg-white border rounded-lg overflow-hidden">
                <iframe 
                  style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }} 
                  width="100%" 
                  height="100%" 
                  src={figmaPreviewUrl}
                  allowFullScreen
                  title="Figma Preview"
                ></iframe>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p>{submission.description}</p>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
            
            {/* Comment Form */}
            <div className="flex items-start space-x-4 mb-6">
              <img 
                src={currentUser?.avatar_url || "https://ui-avatars.com/api/?name=User&background=random"} 
                alt="Your avatar" 
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  rows="3"
                  placeholder="Leave a comment..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      // Handle comment submission
                      if (commentText.trim()) {
                        alert('Comment functionality will be implemented soon!');
                        setCommentText('');
                      }
                    }}
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {submission.comments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-4">
                  <img src={comment.user.avatar} alt={comment.user.name} className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900">{comment.user.name}</h4>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{comment.text}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <button className="text-sm text-gray-500 hover:text-indigo-600">Reply</button>
                      <button className="text-sm text-gray-500 hover:text-indigo-600">Like</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Challenge Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Challenge Info</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Challenge</h3>
                <Link to={`/challenge-detail/${submission.challenge.id}`} className="text-sm text-indigo-600 hover:text-indigo-500">
                  {submission.challenge.title}
                </Link>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Difficulty</h3>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  submission.challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                  submission.challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {submission.challenge.difficulty.charAt(0).toUpperCase() + submission.challenge.difficulty.slice(1)}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Rating</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStarRating(submission.rating)}
                  </div>
                  <span className="text-sm text-gray-600">{submission.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* More from User */}
          {submitter && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">More from {submission.user.name}</h2>
              <div className="space-y-4">
                {/* This would be populated with actual data in a real implementation */}
                <div className="text-sm text-gray-500">
                  Other submissions from this user will appear here.
                </div>
              </div>
              <div className="mt-4">
                <Link to={`/profile/${submitter.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all submissions
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SubmissionDetailPage; 