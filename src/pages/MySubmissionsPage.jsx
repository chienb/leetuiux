import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, getSignedUrl, getPublicUrl } from '../lib/supabase';

const MySubmissionsPage = () => {
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [challengeFilter, setChallengeFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('highest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [challenges, setChallenges] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [availableBuckets, setAvailableBuckets] = useState([]);

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

  // Function to check if an image URL is valid
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

  // Helper function to filter by time
  const filterByTime = (createdAt, timeFilter) => {
    const submissionDate = new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now - submissionDate) / (1000 * 60 * 60 * 24));
    
    switch(timeFilter) {
      case 'week':
        return diffInDays < 7;
      case 'month':
        return diffInDays < 30;
      case 'year':
        return diffInDays < 365;
      default:
        return true;
    }
  };

  // Fetch user's submissions from Supabase
  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Fetch submissions from Supabase
        let { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });
        
        // If there's an error, try a fallback approach
        if (submissionsError) {
          console.warn('Error fetching submissions, trying fallback:', submissionsError);
          
          try {
            // Fallback: Try to fetch submissions without ordering
            let { data: fallbackData, error: fallbackError } = await supabase
              .from('submissions')
              .select('*')
              .eq('user_id', currentUser.id)
              .order('created_at', { ascending: false });
            
            if (fallbackError) throw fallbackError;
            submissionsData = fallbackData;
          } catch (error) {
            throw submissionsError;
          }
        }
        
        if (!submissionsData || submissionsData.length === 0) {
          setSubmissions([]);
          setLoading(false);
          return;
        }

        // Fetch challenges to get their details
        const challengeIds = [...new Set(submissionsData.map(sub => sub.challenge_id))];
        let challengeMap = {}; // Initialize challengeMap here
        
        if (challengeIds.length > 0) {
          const { data: challengesData, error: challengesError } = await supabase
            .from('challenges')
            .select('id, title, difficulty')
            .in('id', challengeIds);

          if (challengesError) {
            console.warn('Error fetching challenges:', challengesError);
          } else if (challengesData) {
            // Create a map of challenge id to challenge details
            challengesData.forEach(challenge => {
              challengeMap[challenge.id] = challenge;
            });
          }
          
          setChallenges(challengeMap);
        }

        // Try to fetch user profiles, but handle the case where the table doesn't exist
        let userMap = {};
        try {
          const userIds = [...new Set(submissionsData.map(sub => sub.user_id))];
          const { data: usersData, error: usersError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);

          if (!usersError && usersData) {
            // Create a map of user id to user details
            usersData.forEach(user => {
              userMap[user.id] = user;
            });
          }
        } catch (error) {
          console.warn('Error fetching user profiles, using default values:', error);
        }

        // Combine all data
        const enrichedSubmissions = submissionsData.map(submission => {
          const challenge = challengeMap[submission.challenge_id] || { 
            id: submission.challenge_id,
            title: `Challenge ${submission.challenge_id}`, 
            difficulty: 'medium' 
          };
          
          // Use user data if available, otherwise use current user's metadata
          const user = userMap[submission.user_id] || { 
            id: submission.user_id,
            full_name: currentUser.user_metadata?.full_name || 'User',
            avatar_url: currentUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=User&background=random`
          };

          // Calculate time ago
          const createdAt = new Date(submission.created_at);
          const now = new Date();
          const diffInDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
          let dateStr;
          if (diffInDays === 0) {
            dateStr = 'Today';
          } else if (diffInDays === 1) {
            dateStr = 'Yesterday';
          } else if (diffInDays < 7) {
            dateStr = `${diffInDays} days ago`;
          } else if (diffInDays < 30) {
            dateStr = `${Math.floor(diffInDays / 7)} weeks ago`;
          } else {
            dateStr = `${Math.floor(diffInDays / 30)} months ago`;
          }

          return {
            id: submission.id,
            challenge_id: submission.challenge_id,
            challenge: challenge.title,
            difficulty: challenge.difficulty,
            image: submission.preview_image,
            user: {
              name: user.full_name,
              avatar: user.avatar_url,
            },
            date: dateStr,
            rating: submission.avg_rating || 0,
            likes: Math.floor(Math.random() * 30), // Mock data for now
            comments: Math.floor(Math.random() * 8), // Mock data for now
            created_at: submission.created_at
          };
        });

        // Process each submission to get valid image URLs
        const processedSubmissions = await Promise.all(
          enrichedSubmissions.map(async (submission) => {
            const validImageUrl = await getValidImageUrl(submission.image);
            return {
              ...submission,
              image: validImageUrl
            };
          })
        );

        setSubmissions(processedSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError(`Failed to load submissions: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubmissions();
  }, [currentUser]);

  // Filter submissions based on search and filters
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.challenge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChallenge = challengeFilter ? submission.challenge === challengeFilter : true;
    const matchesTime = timeFilter ? filterByTime(submission.date, timeFilter) : true;
    return matchesSearch && matchesChallenge && matchesTime;
  });

  // Function to render star rating
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
        </svg>
      );
    }

    return stars;
  };

  // Function to get difficulty badge color
  const getDifficultyBadgeColor = (difficulty) => {
    switch(difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-100';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-100';
      case 'hard':
        return 'bg-red-500/20 text-red-100';
      default:
        return 'bg-gray-500/20 text-gray-100';
    }
  };

  // Get unique challenge names for filter dropdown
  const uniqueChallenges = [...new Set(submissions.map(sub => sub.challenge))];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Submissions</h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select 
              className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={challengeFilter}
              onChange={(e) => setChallengeFilter(e.target.value)}
            >
              <option value="">All Challenges</option>
              {uniqueChallenges.map(challenge => (
                <option key={challenge} value={challenge}>{challenge}</option>
              ))}
            </select>
            <select 
              className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
            <select 
              className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="highest">Highest Rated</option>
              <option value="recent">Most Recent</option>
              <option value="liked">Most Liked</option>
            </select>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button 
              className={`flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium ${viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setViewMode('grid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
              Grid
            </button>
            <button 
              className={`flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium ${viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setViewMode('list')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              List
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredSubmissions.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-500 mb-6">You haven't submitted any solutions to challenges yet.</p>
          <Link to="/challenges" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-transparent bg-indigo-600 text-white hover:bg-indigo-700">
            Browse Challenges
          </Link>
        </div>
      )}

      {/* Submissions Grid */}
      {!loading && !error && filteredSubmissions.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map(submission => (
            <Link key={submission.id} to={`/submission-detail/${submission.id}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden block hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="relative aspect-video">
                <img 
                  src={submission.image} 
                  alt="Submission preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    console.error('Image failed to load:', submission.image);
                    e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <Link 
                    to={`/challenge-detail/${submission.challenge_id}`}
                    className="text-sm font-medium text-white hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {submission.challenge}
                  </Link>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDifficultyBadgeColor(submission.difficulty)}`}>
                    {submission.difficulty.charAt(0).toUpperCase() + submission.difficulty.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src={submission.user.avatar} alt="User avatar" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{submission.user.name}</h3>
                      <span className="text-xs text-gray-500">{submission.date}</span>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStarRating(submission.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{submission.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center text-gray-500 hover:text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 10v12"></path>
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                      </svg>
                      {submission.likes}
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      {submission.comments}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Submissions List */}
      {!loading && !error && filteredSubmissions.length > 0 && viewMode === 'list' && (
        <div className="space-y-4">
          {filteredSubmissions.map(submission => (
            <Link key={submission.id} to={`/submission-detail/${submission.id}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden block hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 relative">
                  <img 
                    src={submission.image} 
                    alt="Submission preview" 
                    className="w-full h-full object-cover md:h-40" 
                    onError={(e) => {
                      console.error('Image failed to load:', submission.image);
                      e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white md:hidden">
                    <Link 
                      to={`/challenge-detail/${submission.challenge_id}`}
                      className="text-sm font-medium text-white hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {submission.challenge}
                    </Link>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDifficultyBadgeColor(submission.difficulty)}`}>
                      {submission.difficulty.charAt(0).toUpperCase() + submission.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="hidden md:block">
                      <Link 
                        to={`/challenge-detail/${submission.challenge_id}`}
                        className="text-lg font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {submission.challenge}
                      </Link>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDifficultyBadgeColor(submission.difficulty)}`}>
                        {submission.difficulty.charAt(0).toUpperCase() + submission.difficulty.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStarRating(submission.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{submission.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <img src={submission.user.avatar} alt="User avatar" className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{submission.user.name}</h3>
                        <span className="text-xs text-gray-500">{submission.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center text-gray-500 hover:text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 10v12"></path>
                          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                        </svg>
                        {submission.likes}
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {submission.comments}
                      </button>
                      <button className="text-gray-500 hover:text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && filteredSubmissions.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              <span className="sr-only">Previous</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-transparent bg-indigo-600 text-white">1</button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              <span className="sr-only">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </main>
  );
};

export default MySubmissionsPage; 