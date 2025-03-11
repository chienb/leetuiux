import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllChallenges } from '../lib/database';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const result = await getAllChallenges();
      if (result.success) {
        // Transform the data to match our UI expectations
        const formattedChallenges = result.data.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty || 'easy',
          frequency: challenge.frequency || 'medium',
          submissions: 0, // We'll implement this in a future update
          tags: challenge.tags || [],
          companies: challenge.companies || []
        }));
        setChallenges(formattedChallenges);
      } else {
        setError('Failed to fetch challenges');
        // Use mock challenges as fallback
        setChallenges(mockChallenges);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('An error occurred while fetching challenges');
      // Use mock challenges as fallback
      setChallenges(mockChallenges);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for challenges
  const mockChallenges = [
    {
      id: 1,
      title: 'E-commerce Product Page Redesign',
      description: 'Redesign a product page for an e-commerce website to improve user experience and conversion rates.',
      difficulty: 'easy',
      frequency: 'high',
      companies: ['airbnb', 'uber', 'spotify', 'amazon', 'facebook', 'google'],
      tags: ['UI Design', 'E-commerce', 'Web'],
      submissions: 128
    },
    {
      id: 2,
      title: 'Mobile Banking App Dashboard',
      description: 'Design a user-friendly dashboard for a mobile banking application that displays key financial information.',
      difficulty: 'medium',
      frequency: 'medium',
      companies: ['chase', 'paypal', 'stripe', 'robinhood'],
      tags: ['UI Design', 'Mobile', 'Dashboard'],
      submissions: 86
    },
    {
      id: 3,
      title: 'SaaS Analytics Dashboard',
      description: 'Create a comprehensive analytics dashboard for a SaaS platform that visualizes complex data in an intuitive way.',
      difficulty: 'hard',
      frequency: 'medium',
      companies: ['salesforce', 'hubspot', 'slack', 'notion'],
      tags: ['UI Design', 'Dashboard', 'Data Visualization'],
      submissions: 42
    },
    {
      id: 4,
      title: 'Food Delivery App Checkout Flow',
      description: 'Design an efficient and user-friendly checkout flow for a food delivery mobile application.',
      difficulty: 'medium',
      frequency: 'high',
      companies: ['doordash', 'uber', 'grubhub', 'instacart'],
      tags: ['UX Design', 'Mobile', 'Checkout'],
      submissions: 74
    },
    {
      id: 5,
      title: 'Travel Booking Website Redesign',
      description: 'Redesign a travel booking website to improve the user experience and conversion rates.',
      difficulty: 'medium',
      frequency: 'medium',
      companies: ['airbnb', 'booking', 'expedia', 'tripadvisor'],
      tags: ['UI Design', 'Web', 'Travel'],
      submissions: 63
    },
    {
      id: 6,
      title: 'Social Media Profile Page',
      description: 'Design a modern and engaging user profile page for a social media platform.',
      difficulty: 'easy',
      frequency: 'medium',
      companies: ['facebook', 'twitter', 'instagram', 'linkedin'],
      tags: ['UI Design', 'Social Media', 'Web'],
      submissions: 95
    }
  ];

  // Filter challenges based on search and filters
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter ? challenge.difficulty === difficultyFilter.toLowerCase() : true;
    const matchesFrequency = frequencyFilter ? challenge.frequency === frequencyFilter.toLowerCase() : true;
    const matchesCompany = companyFilter ? challenge.companies.includes(companyFilter.toLowerCase()) : true;
    
    return matchesSearch && matchesDifficulty && matchesFrequency && matchesCompany;
  });

  // Function to get company logo URL
  const getCompanyLogo = (company) => {
    return `https://logo.clearbit.com/${company}.com`;
  };

  // Function to get difficulty badge color
  const getDifficultyBadgeColor = (difficulty) => {
    switch(difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get frequency badge color
  const getFrequencyBadgeColor = (frequency) => {
    switch(frequency) {
      case 'high':
        return 'bg-indigo-100 text-indigo-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Add a loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Challenges</h1>
        <p className="text-gray-600 mb-8">
          Browse through our collection of UI/UX design challenges to practice and improve your skills.
        </p>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Add an error state with fallback to mock data
  if (error && challenges.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Challenges</h1>
        <p className="text-gray-600 mb-8">
          Browse through our collection of UI/UX design challenges to practice and improve your skills.
        </p>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p className="font-medium">Error loading challenges</p>
          <p>{error}</p>
          <button 
            onClick={fetchChallenges}
            className="mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Challenges</h1>
        <p className="text-gray-600">
          Browse through our collection of UI/UX design challenges to practice and improve your skills.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              placeholder="Search challenges..."
              className="h-10 w-full sm:w-64 rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <select 
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="ui-design">UI Design</option>
              <option value="ux-design">UX Design</option>
              <option value="mobile">Mobile</option>
              <option value="web">Web</option>
              <option value="dashboard">Dashboard</option>
            </select>

            <select 
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="">All Companies</option>
              <option value="airbnb">Airbnb</option>
              <option value="uber">Uber</option>
              <option value="spotify">Spotify</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google</option>
            </select>

            <select 
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
            >
              <option value="">Interview Frequency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        <Link to="/challenge-detail" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Random Challenge
        </Link>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredChallenges.map(challenge => (
          <Link 
            key={challenge.id}
            to={`/challenge-detail/${challenge.id}`} 
            className="rounded-lg border border-gray-200 bg-white shadow-sm h-full flex flex-col hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getDifficultyBadgeColor(challenge.difficulty)}`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getFrequencyBadgeColor(challenge.frequency)}`}>
                      {challenge.frequency.charAt(0).toUpperCase() + challenge.frequency.slice(1)} Frequency
                    </span>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {(challenge.companies || []).slice(0, 3).map((company, index) => (
                    <img 
                      key={index}
                      src={getCompanyLogo(company)} 
                      alt={company} 
                      className="w-6 h-6 rounded-full ring-2 ring-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${company}&background=random`;
                      }}
                    />
                  ))}
                  {(challenge.companies || []).length > 3 && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 ring-2 ring-white">
                      <span className="text-xs font-medium text-gray-500">+{challenge.companies.length - 3}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 pt-2 flex-grow">
              <p className="text-sm text-gray-600 line-clamp-3">{challenge.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {(challenge.tags || []).map((tag, index) => (
                  <span key={index} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>{challenge.submissions} submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{Math.floor(challenge.submissions * 0.3)} interview reports</span>
                  <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs bg-indigo-100 text-indigo-800">Premium</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <nav className="flex items-center gap-1">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            <span className="sr-only">Previous</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-transparent bg-indigo-600 text-white">1</button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</button>
          <span className="inline-flex items-center justify-center h-10 px-2 text-gray-500">...</span>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">8</button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            <span className="sr-only">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </main>
  );
};

export default ChallengesPage; 