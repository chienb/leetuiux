import { useState } from 'react';
import { Link } from 'react-router-dom';

const BadgesPage = () => {
  const [filter, setFilter] = useState('all');
  
  // Mock badges data
  const badges = [
    {
      id: 1,
      name: 'Fast Solver',
      description: 'Completed 5 challenges in under 24 hours each',
      icon: 'lightning',
      color: 'indigo',
      earned: true,
      date: '2 weeks ago',
      category: 'achievement'
    },
    {
      id: 2,
      name: 'Creative',
      description: 'Received 10 "creative solution" votes from the community',
      icon: 'sparkles',
      color: 'purple',
      earned: true,
      date: '1 month ago',
      category: 'achievement'
    },
    {
      id: 3,
      name: 'Consistent',
      description: 'Completed at least one challenge per week for 4 consecutive weeks',
      icon: 'calendar',
      color: 'green',
      earned: true,
      date: '3 months ago',
      category: 'achievement'
    },
    {
      id: 4,
      name: 'Team Player',
      description: 'Provided feedback on 20 other submissions',
      icon: 'users',
      color: 'blue',
      earned: true,
      date: '2 months ago',
      category: 'community'
    },
    {
      id: 5,
      name: 'Problem Solver',
      description: 'Completed 10 hard difficulty challenges',
      icon: 'puzzle',
      color: 'yellow',
      earned: true,
      date: '1 month ago',
      category: 'achievement'
    },
    {
      id: 6,
      name: 'Mentor',
      description: 'Helped 5 users improve their submissions through feedback',
      icon: 'academic-cap',
      color: 'red',
      earned: true,
      date: '2 weeks ago',
      category: 'community'
    },
    {
      id: 7,
      name: 'Pro Member',
      description: 'Subscribed to LeetUIUX Pro membership',
      icon: 'badge-check',
      color: 'indigo',
      earned: true,
      date: '6 months ago',
      category: 'membership'
    },
    {
      id: 8,
      name: 'Top Contributor',
      description: 'In the top 5% of active community members',
      icon: 'star',
      color: 'green',
      earned: true,
      date: '1 month ago',
      category: 'community'
    },
    {
      id: 9,
      name: 'Mobile Expert',
      description: 'Completed 15 mobile design challenges',
      icon: 'device-mobile',
      color: 'blue',
      earned: false,
      progress: 60,
      category: 'expertise'
    },
    {
      id: 10,
      name: 'Web Wizard',
      description: 'Completed 20 web design challenges',
      icon: 'globe',
      color: 'purple',
      earned: false,
      progress: 75,
      category: 'expertise'
    },
    {
      id: 11,
      name: 'Dashboard Master',
      description: 'Completed 10 dashboard design challenges',
      icon: 'template',
      color: 'yellow',
      earned: false,
      progress: 40,
      category: 'expertise'
    },
    {
      id: 12,
      name: 'Perfect Score',
      description: 'Received a perfect 5.0 rating on a submission',
      icon: 'trophy',
      color: 'gold',
      earned: false,
      progress: 0,
      category: 'achievement'
    }
  ];

  // Filter badges based on selected filter
  const filteredBadges = filter === 'all' 
    ? badges 
    : filter === 'earned' 
      ? badges.filter(badge => badge.earned) 
      : filter === 'in-progress' 
        ? badges.filter(badge => !badge.earned && badge.progress > 0)
        : badges.filter(badge => badge.category === filter);

  // Function to render badge icon
  const renderIcon = (icon, color) => {
    switch (icon) {
      case 'lightning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'sparkles':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'puzzle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        );
      case 'academic-cap':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      case 'badge-check':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'star':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'device-mobile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'globe':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'template':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
      case 'trophy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get badge background color class
  const getBadgeColorClass = (color, earned) => {
    if (!earned) return 'bg-gray-100';
    
    switch (color) {
      case 'indigo':
        return 'bg-indigo-100';
      case 'purple':
        return 'bg-purple-100';
      case 'green':
        return 'bg-green-100';
      case 'blue':
        return 'bg-blue-100';
      case 'yellow':
        return 'bg-yellow-100';
      case 'red':
        return 'bg-red-100';
      case 'gold':
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Get badge text color class
  const getBadgeTextColorClass = (color, earned) => {
    if (!earned) return 'text-gray-400';
    
    switch (color) {
      case 'indigo':
        return 'text-indigo-600';
      case 'purple':
        return 'text-purple-600';
      case 'green':
        return 'text-green-600';
      case 'blue':
        return 'text-blue-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'red':
        return 'text-red-600';
      case 'gold':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Badges & Credentials</h1>
          <p className="text-gray-600">
            Showcase your achievements and skills with badges earned through challenges and community participation.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Badges
            </button>
            <button
              onClick={() => setFilter('earned')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'earned'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Earned
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'in-progress'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('achievement')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'achievement'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setFilter('community')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'community'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => setFilter('expertise')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'expertise'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Expertise
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full ${getBadgeColorClass(badge.color, badge.earned)} flex items-center justify-center mb-4`}>
                <div className={getBadgeTextColorClass(badge.color, badge.earned)}>
                  {renderIcon(badge.icon, badge.color)}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{badge.name}</h3>
              <p className="text-sm text-gray-600 text-center mb-4">{badge.description}</p>
              
              {badge.earned ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Earned {badge.date}
                </span>
              ) : (
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-500">{badge.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${badge.progress || 0}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BadgesPage; 