import { useState } from 'react';

const CompanyInsights = ({ insights }) => {
  const [voted, setVoted] = useState(null);
  
  // Extract data from insights
  const {
    interview_frequency = 'low',
    seen_in_interviews = { yes: 0, no: 0 },
    last_reported = 'N/A',
    companies = [],
    common_role = 'UI/UX Designer',
    interview_stage = 'Take-home'
  } = insights || {};
  
  // Calculate frequency percentage for the progress bar
  const frequencyPercentage = {
    high: 75,
    medium: 50,
    low: 25
  }[interview_frequency] || 25;
  
  // Handle voting
  const handleVote = (vote) => {
    if (voted === vote) return;
    setVoted(vote);
    // In a real app, you would send this to your backend
    console.log(`User voted: ${vote}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Company Insights</h2>
        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-800">
          Premium
        </span>
      </div>
      
      {/* Interview Frequency */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Interview Frequency</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${frequencyPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 capitalize">{interview_frequency}</span>
        </div>
      </div>

      {/* Companies */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Top Companies</h3>
        <div className="space-y-3">
          {(companies || []).slice(0, 3).map((company, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={`https://logo.clearbit.com/${company.name.toLowerCase()}.com`} 
                  alt={company.name} 
                  className="w-6 h-6 rounded"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=random`;
                  }}
                />
                <span className="text-sm text-gray-900">{company.name}</span>
              </div>
              <span className="text-xs text-gray-500">{company.reports} reports</span>
            </div>
          ))}
        </div>
        {companies.length > 3 && (
          <button className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all companies →
          </button>
        )}
      </div>

      {/* Interview Poll */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Seen in Interviews?</h3>
        <div className="flex gap-2">
          <button 
            className={`flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 ${
              voted === 'yes' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
            onClick={() => handleVote('yes')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Yes ({seen_in_interviews.yes})
          </button>
          <button 
            className={`flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 ${
              voted === 'no' 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleVote('no')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            No ({seen_in_interviews.no})
          </button>
        </div>
      </div>

      {/* Interview Context */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Interview Context</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Most common for:</span>
            <span className="text-sm font-medium text-gray-900">{common_role}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Interview stage:</span>
            <span className="text-sm font-medium text-gray-900">{interview_stage}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last reported:</span>
            <span className="text-sm font-medium text-gray-900">{last_reported}</span>
          </div>
        </div>
      </div>

      {/* Premium CTA */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">
            Unlock detailed interview insights, company-specific requirements, and success patterns.
          </p>
          <a 
            href="#" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-indigo-600 text-white hover:bg-indigo-700 w-full"
          >
            Upgrade to Premium
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyInsights; 