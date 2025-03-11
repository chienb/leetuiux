import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');

  // Mock user data with real user information where available
  const userData = {
    name: currentUser?.name || 'Sarah Johnson',
    avatar: currentUser?.avatar || 'https://randomuser.me/api/portraits/women/44.jpg',
    email: currentUser?.email || 'sarah.johnson@example.com',
    location: 'San Francisco, CA',
    title: 'UI/UX Designer',
    bio: 'UI/UX designer with 5+ years of experience creating beautiful, functional interfaces. Passionate about accessibility and user-centered design.',
    stats: {
      challengesCompleted: 42,
      successRate: 89,
      ranking: 'Top 5%',
    },
    achievements: [
      { name: 'Fast Solver', icon: 'lightning', color: 'indigo' },
      { name: 'Creative', icon: 'sparkles', color: 'purple' },
      { name: 'Consistent', icon: 'calendar', color: 'green' },
      { name: 'Team Player', icon: 'users', color: 'blue' },
      { name: 'Problem Solver', icon: 'puzzle', color: 'yellow' },
      { name: 'Mentor', icon: 'academic-cap', color: 'red' },
    ],
    badges: [
      { name: 'Pro Member', icon: 'badge-check', color: 'indigo' },
      { name: 'Top Contributor', icon: 'star', color: 'green' },
    ],
    skills: [
      { name: 'UI Design', level: 95 },
      { name: 'UX Research', level: 85 },
      { name: 'Prototyping', level: 90 },
      { name: 'Figma', level: 95 },
      { name: 'Adobe XD', level: 80 },
      { name: 'Sketch', level: 75 },
    ],
    recentSubmissions: [
      {
        id: 1,
        challenge: 'E-commerce Product Page Redesign',
        date: '2 weeks ago',
        status: 'completed',
        score: 95,
        image: 'https://placehold.co/600x400/e2e8f0/475569?text=E-commerce+Redesign',
      },
      {
        id: 2,
        challenge: 'Mobile Banking App Dashboard',
        date: '1 month ago',
        status: 'completed',
        score: 88,
        image: 'https://placehold.co/600x400/e2e8f0/475569?text=Banking+App',
      },
      {
        id: 3,
        challenge: 'Food Delivery App Checkout Flow',
        date: '2 months ago',
        status: 'completed',
        score: 92,
        image: 'https://placehold.co/600x400/e2e8f0/475569?text=Food+Delivery+App',
      },
    ],
  };

  // Function to render achievement icon
  const renderIcon = (icon, color) => {
    switch (icon) {
      case 'lightning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'sparkles':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'puzzle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        );
      case 'academic-cap':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img src={userData.avatar} alt="Profile Picture" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
            <p className="text-gray-600">{userData.title} • {userData.location}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {userData.badges.map((badge, index) => (
                <span key={index} className={`inline-flex items-center rounded-full bg-${badge.color}-100 px-2.5 py-0.5 text-xs font-medium text-${badge.color}-800`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    {badge.icon === 'badge-check' ? (
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    )}
                  </svg>
                  {badge.name}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">{userData.bio}</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Edit Profile
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Achievements and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stats</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Challenges Completed</span>
                <span className="text-sm font-medium text-indigo-600">{userData.stats.challengesCompleted}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Success Rate</span>
                <span className="text-sm font-medium text-indigo-600">{userData.stats.successRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${userData.stats.successRate}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Ranking</span>
                <span className="text-sm font-medium text-indigo-600">{userData.stats.ranking}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-3 gap-4">
            {userData.achievements.map((achievement, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full bg-${achievement.color}-100 flex items-center justify-center mb-2`}>
                  {renderIcon(achievement.icon, achievement.color)}
                </div>
                <span className="text-xs text-gray-700 text-center">{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="space-y-4">
            {userData.skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className="text-sm font-medium text-indigo-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'submissions'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submissions
            </button>
            <Link
              to="/badges"
              className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Badges
            </Link>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'activity'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activity
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'submissions' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.recentSubmissions.map((submission) => (
                  <Link key={submission.id} to={`/submission-detail/${submission.id}`} className="block rounded-lg border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img src={submission.image} alt={submission.challenge} className="object-cover w-full h-full" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{submission.challenge}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{submission.date}</span>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Score: {submission.score}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link to="/submissions" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View All Submissions →
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Badges</h2>
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Badges Coming Soon</h3>
                <p className="text-gray-600 mb-4">We're working on a badge system to recognize your achievements!</p>
                <Link to="/challenges" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Complete More Challenges
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Completed <span className="font-medium">E-commerce Product Page Redesign</span> challenge</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Earned <span className="font-medium">Top Contributor</span> badge</p>
                    <p className="text-xs text-gray-500">1 month ago</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Commented on <span className="font-medium">Mobile Banking App Dashboard</span> challenge</p>
                    <p className="text-xs text-gray-500">1 month ago</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Load More Activity →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage; 