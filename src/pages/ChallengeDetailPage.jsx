import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CompanyInsights from '../components/Challenge/CompanyInsights';
import { createComment, getCommentsByChallengeId, likeComment, getChallengeById } from '../lib/database';

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('description');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [challengeLoading, setChallengeLoading] = useState(true);
  const [challengeError, setChallengeError] = useState(null);

  // Fetch challenge data
  useEffect(() => {
    if (id) {
      fetchChallenge();
    }
  }, [id]);

  const fetchChallenge = async () => {
    setChallengeLoading(true);
    try {
      const result = await getChallengeById(id);
      if (result.success && result.data) {
        // Transform the data to match our UI expectations
        setChallenge({
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          longDescription: result.data.long_description,
          difficulty: result.data.difficulty || 'easy',
          frequency: result.data.frequency || 'medium',
          createdAt: new Date(result.data.created_at).toLocaleDateString(),
          submissions: 0, // We'll implement this in a future update
          tags: result.data.tags || ['UI Design', 'Web'],
          companies: result.data.companies || ['Company'],
          insights: {
            interview_frequency: 'high',
            seen_in_interviews: { yes: 42, no: 15 },
            last_reported: '2 days ago',
            companies: [
              { name: 'Airbnb', reports: 12 },
              { name: 'Uber', reports: 8 },
              { name: 'Spotify', reports: 6 }
            ],
            common_role: 'Senior Product Designer',
            interview_stage: 'Take-home (85%)'
          },
          requirements: [
            'Create a responsive product page design',
            'Include high-quality product images and information',
            'Design an intuitive navigation system',
            'Optimize the checkout process'
          ],
          deliverables: [
            'High-fidelity mockups of the product page',
            'Interactive prototype demonstrating key interactions',
            'Design system components used in the solution',
            'Brief explanation of design decisions'
          ],
          resources: [
            { name: 'E-commerce UX Best Practices', link: '#' },
            { name: 'Product Page Design Examples', link: '#' },
            { name: 'Conversion Rate Optimization Guide', link: '#' }
          ],
          rating: 4.2,
          author: 'Alex Morgan'
        });
      } else {
        setChallengeError('Failed to fetch challenge');
        // Use a mock challenge as fallback
        setChallenge({
          id: id || 1,
          title: 'E-commerce Product Page Redesign',
          description: 'E-commerce websites often struggle with product pages that fail to effectively showcase products and drive conversions. Your challenge is to redesign a product page for an e-commerce website to improve user experience and increase conversion rates.',
          longDescription: 'The redesigned page should effectively display product information, images, pricing, and related products while guiding users toward making a purchase decision.',
          difficulty: 'easy',
          frequency: 'high',
          createdAt: 'Jan 15, 2023',
          submissions: 128,
          tags: ['UI Design', 'E-commerce', 'Web'],
          companies: ['Airbnb', 'Uber', 'Spotify', 'Amazon', 'Google', 'Facebook'],
          insights: {
            interview_frequency: 'high',
            seen_in_interviews: { yes: 42, no: 15 },
            last_reported: '2 days ago',
            companies: [
              { name: 'Airbnb', reports: 12 },
              { name: 'Uber', reports: 8 },
              { name: 'Spotify', reports: 6 }
            ],
            common_role: 'Senior Product Designer',
            interview_stage: 'Take-home (85%)'
          },
          requirements: [
            'Create a responsive product page design',
            'Include high-quality product images and information',
            'Design an intuitive navigation system',
            'Optimize the checkout process'
          ],
          deliverables: [
            'High-fidelity mockups of the product page',
            'Interactive prototype demonstrating key interactions',
            'Design system components used in the solution',
            'Brief explanation of design decisions'
          ],
          resources: [
            { name: 'E-commerce UX Best Practices', link: '#' },
            { name: 'Product Page Design Examples', link: '#' },
            { name: 'Conversion Rate Optimization Guide', link: '#' }
          ],
          rating: 4.2,
          author: 'Alex Morgan'
        });
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
      setChallengeError('An error occurred while fetching the challenge');
      // Use a mock challenge as fallback
      setChallenge({
        id: id || 1,
        title: 'E-commerce Product Page Redesign',
        description: 'E-commerce websites often struggle with product pages that fail to effectively showcase products and drive conversions. Your challenge is to redesign a product page for an e-commerce website to improve user experience and increase conversion rates.',
        longDescription: 'The redesigned page should effectively display product information, images, pricing, and related products while guiding users toward making a purchase decision.',
        difficulty: 'easy',
        frequency: 'high',
        createdAt: 'Jan 15, 2023',
        submissions: 128,
        tags: ['UI Design', 'E-commerce', 'Web'],
        companies: ['Airbnb', 'Uber', 'Spotify', 'Amazon', 'Google', 'Facebook'],
        insights: {
          interview_frequency: 'high',
          seen_in_interviews: { yes: 42, no: 15 },
          last_reported: '2 days ago',
          companies: [
            { name: 'Airbnb', reports: 12 },
            { name: 'Uber', reports: 8 },
            { name: 'Spotify', reports: 6 }
          ],
          common_role: 'Senior Product Designer',
          interview_stage: 'Take-home (85%)'
        },
        requirements: [
          'Create a responsive product page design',
          'Include high-quality product images and information',
          'Design an intuitive navigation system',
          'Optimize the checkout process'
        ],
        deliverables: [
          'High-fidelity mockups of the product page',
          'Interactive prototype demonstrating key interactions',
          'Design system components used in the solution',
          'Brief explanation of design decisions'
        ],
        resources: [
          { name: 'E-commerce UX Best Practices', link: '#' },
          { name: 'Product Page Design Examples', link: '#' },
          { name: 'Conversion Rate Optimization Guide', link: '#' }
        ],
        rating: 4.2,
        author: 'Alex Morgan'
      });
    } finally {
      setChallengeLoading(false);
    }
  };

  // Fetch comments when the challenge ID or active tab changes
  useEffect(() => {
    if (activeTab === 'discussion' && id) {
      fetchComments();
    }
  }, [activeTab, id]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const result = await getCommentsByChallengeId(id);
      if (result.success) {
        // Transform the data to match our UI expectations
        const formattedComments = result.data.map(comment => ({
          id: comment.id,
          text: comment.text,
          timestamp: comment.created_at,
          likes: comment.likes_count || 0,
          user: {
            id: comment.user.id,
            name: comment.user.user_metadata?.full_name || comment.user.email?.split('@')[0] || 'User',
            avatar: comment.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.email)}&background=random`
          },
          replies: [] // We'll implement replies in a future update
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setCommentLoading(true);
    
    try {
      const commentData = {
        challengeId: id,
        userId: currentUser.id,
        text: commentText
      };
      
      const result = await createComment(commentData);
      
      if (result.success) {
        // Clear the comment text
        setCommentText('');
        // Refresh comments
        fetchComments();
      } else {
        alert('Failed to submit comment. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('An error occurred while submitting your comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/challenge-detail/${id}` } });
      return;
    }
    
    try {
      const result = await likeComment(commentId, currentUser.id);
      
      if (result.success) {
        // Update the UI optimistically
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: result.action === 'liked' ? comment.likes + 1 : Math.max(0, comment.likes - 1)
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  // Add a loading state
  if (challengeLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Add an error state
  if (challengeError && !challenge) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p className="font-medium">Error loading challenge</p>
          <p>{challengeError}</p>
          <button 
            onClick={fetchChallenge}
            className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Make sure challenge exists before rendering
  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-4">
          <p className="font-medium">Challenge not found</p>
          <p>The challenge you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/challenges"
            className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Browse Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link to="/challenges" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          Back to Challenges
        </Link>
      </div>

      {/* Challenge Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          {/* Challenge Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    challenge.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800' 
                      : challenge.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
                    {challenge.frequency.charAt(0).toUpperCase() + challenge.frequency.slice(1)} Frequency
                  </span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                    {challenge.submissions} submissions
                  </span>
                </div>
              </div>
              
              {/* Action Buttons - Moved to top right */}
              <div className="flex gap-3">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Save
                </button>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                  Share
                </button>
              </div>
            </div>
            
            {/* Challenge Description */}
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(challenge.tags || []).map((tag, index) => (
                <span key={index} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Submit Challenge Button */}
            <div className="mt-4 flex flex-col items-center">
              {isAuthenticated() ? (
                <Link 
                  to={`/challenge-submit/${challenge.id}`} 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-8 py-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit Solution
                </Link>
              ) : (
                <div className="space-y-2 text-center">
                  <Link 
                    to="/login" 
                    state={{ from: `/challenge-detail/${challenge.id}` }}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-8 py-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Log in to Submit Solution
                  </Link>
                  <p className="text-xs text-gray-500">
                    Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">Sign up</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Challenge Content Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveTab('description')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'description'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('submissions')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'submissions'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Submissions
                </button>
                <button 
                  onClick={() => setActiveTab('discussion')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'discussion'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Discussion
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                    <div className="prose max-w-none text-gray-600">
                      <p className="mb-4">
                        {challenge.description}
                      </p>
                      <p>
                        {challenge.longDescription}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                    <ul className="space-y-3 text-gray-600">
                      {(challenge.requirements || []).map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Constraints</h2>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Design must be responsive (desktop and mobile)
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Follow accessibility best practices
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Design should be realistic and implementable
                      </li>
                    </ul>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Deliverables</h2>
                    <ul className="space-y-3 text-gray-600">
                      {(challenge.deliverables || []).map((deliverable, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Resources</h2>
                    <ul className="space-y-3 text-gray-600">
                      {(challenge.resources || []).map((resource, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                          </svg>
                          <a href={resource.link} className="text-indigo-600 hover:text-indigo-500">
                            {resource.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'submissions' && (
                <div>
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to submit a solution to this challenge!</p>
                    <Link to={`/challenge-submit/${challenge.id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Submit Your Solution
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div>
                  {loading ? (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Loading comments...</h3>
                    </div>
                  ) : comments.length > 0 ? (
                    <div>
                      {/* Comment Form */}
                      <div className="mt-6">
                        {isAuthenticated() ? (
                          <form onSubmit={handleCommentSubmit}>
                            <div className="mb-4">
                              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                                Add a comment
                              </label>
                              <textarea
                                id="comment"
                                rows="3"
                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                placeholder="Share your thoughts..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                              ></textarea>
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                Post Comment
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="bg-gray-50 rounded-md p-4 text-center">
                            <p className="text-sm text-gray-700 mb-2">
                              Please <Link to="/login" state={{ from: `/challenge-detail/${challenge.id}` }} className="text-indigo-600 hover:text-indigo-500">log in</Link> to join the discussion.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Comments */}
                      <div className="space-y-6">
                        {(comments || []).map((comment) => (
                          <div key={comment.id} className="flex items-start gap-4">
                            <img src={comment.user.avatar} alt="User avatar" className="h-10 w-10 rounded-full object-cover" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-medium text-gray-900">{comment.user.name}</h3>
                                <span className="text-xs text-gray-500">{comment.date}</span>
                              </div>
                              <div className="text-sm text-gray-600 mb-3">
                                <p>{comment.text}</p>
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <button 
                                  onClick={() => isAuthenticated() ? handleLike(comment.id) : navigate('/login', { state: { from: `/challenge-detail/${challenge.id}` } })}
                                  className="inline-flex items-center text-gray-500 hover:text-indigo-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                  </svg>
                                  <span>{comment.likes}</span>
                                </button>
                                <button className="text-gray-500 hover:text-indigo-600">Reply</button>
                              </div>
                              
                              {/* Replies */}
                              {(comment.replies || []).length > 0 && (
                                <div className="mt-4 pl-8 space-y-4">
                                  {(comment.replies || []).map((reply) => (
                                    <div key={reply.id} className="flex items-start gap-4">
                                      <img src={reply.user.avatar} alt="User avatar" className="h-8 w-8 rounded-full object-cover" />
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <h3 className="text-sm font-medium text-gray-900">{reply.user.name}</h3>
                                          <span className="text-xs text-gray-500">{reply.date}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3">
                                          <p>{reply.text}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs">
                                          <button 
                                            onClick={() => isAuthenticated() ? handleLike(reply.id) : navigate('/login', { state: { from: `/challenge-detail/${challenge.id}` } })}
                                            className="inline-flex items-center text-gray-500 hover:text-indigo-600"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                            </svg>
                                            <span>{reply.likes}</span>
                                          </button>
                                          <button className="text-gray-500 hover:text-indigo-600">Reply</button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Load more comments</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
                      <p className="text-gray-600 mb-4">Start a discussion about this challenge!</p>
                      {currentUser ? (
                        <button 
                          onClick={() => setActiveTab('discussion')} 
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Start Discussion
                        </button>
                      ) : (
                        <Link 
                          to="/login" 
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Sign In to Start Discussion
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3">
          {/* Challenge Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Challenge Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Difficulty</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Submissions</span>
                <span className="text-sm font-medium">{challenge.submissions}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <div className="flex items-center">
                  <div className="flex mr-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star <= Math.floor(challenge.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium">{challenge.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created by</span>
                <div className="flex items-center">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Creator" className="h-6 w-6 rounded-full mr-2" />
                  <Link to="/profile/creator" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">{challenge.author}</Link>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium">{challenge.createdAt}</span>
              </div>
            </div>
          </div>
          
          {/* Company Insights */}
          <CompanyInsights insights={challenge.insights} />
          
          {/* Recent Submissions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Submissions</h3>
              <Link to={`/challenges/${challenge.id}/submissions`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View All</Link>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <Link to={`/submissions/123`} className="block hover:bg-gray-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="User" className="h-8 w-8 rounded-full mr-2" />
                        <span className="text-sm font-medium text-gray-900">Sophia Martinez</span>
                      </div>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <div className="relative h-32 bg-gray-100 rounded-md mb-2 overflow-hidden">
                      <img 
                        src="https://via.placeholder.com/600x400/f3f4f6/6366f1?text=E-commerce+Design" 
                        alt="Submission preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs font-medium">4.2</span>
                      </div>
                      <span className="text-xs text-gray-500">12 comments</span>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <Link to={`/submissions/124`} className="block hover:bg-gray-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="User" className="h-8 w-8 rounded-full mr-2" />
                        <span className="text-sm font-medium text-gray-900">Alex Thompson</span>
                      </div>
                      <span className="text-xs text-gray-500">4 days ago</span>
                    </div>
                    <div className="relative h-32 bg-gray-100 rounded-md mb-2 overflow-hidden">
                      <img 
                        src="https://via.placeholder.com/600x400/f3f4f6/6366f1?text=Product+Page" 
                        alt="Submission preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${star <= 3 ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs font-medium">3.8</span>
                      </div>
                      <span className="text-xs text-gray-500">8 comments</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChallengeDetailPage; 