import { Link } from 'react-router-dom';

const ChallengeCard = ({ challenge }) => {
  const { id, title, description, difficulty, tags, company_insights } = challenge;
  
  // Extract company data from company_insights
  const companies = company_insights?.companies || [];
  const interviewFrequency = company_insights?.interview_frequency || 'low';
  
  // Determine badge color based on difficulty
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  }[difficulty] || 'bg-gray-100 text-gray-800';
  
  // Determine frequency badge color
  const frequencyColor = {
    high: 'bg-indigo-100 text-indigo-800',
    medium: 'bg-blue-100 text-blue-800',
    low: 'bg-gray-100 text-gray-800',
  }[interviewFrequency] || 'bg-gray-100 text-gray-800';

  return (
    <Link to={`/challenges/${id}`} className="rounded-lg border border-gray-200 bg-white shadow-sm h-full flex flex-col hover:border-indigo-300 hover:shadow-md transition-all">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyColor}`}>
                {difficulty}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${frequencyColor}`}>
                {interviewFrequency.charAt(0).toUpperCase() + interviewFrequency.slice(1)} Frequency
              </span>
            </div>
          </div>
          {(companies || []).length > 0 && (
            <div className="flex -space-x-2">
              {(companies || []).slice(0, 3).map((company, index) => (
                <img 
                  key={index}
                  src={`https://logo.clearbit.com/${company.name.toLowerCase()}.com`} 
                  alt={company.name} 
                  className="w-6 h-6 rounded-full ring-2 ring-white"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=random`;
                  }}
                />
              ))}
              {(companies || []).length > 3 && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 ring-2 ring-white">
                  <span className="text-xs font-medium text-gray-500">+{(companies || []).length - 3}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="p-6 pt-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {tags && tags.map((tag, index) => (
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
            <span>128 submissions</span>
          </div>
          {company_insights?.seen_in_interviews && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {company_insights.seen_in_interviews.yes || 0} interview reports
              </span>
              <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs bg-indigo-100 text-indigo-800">
                Premium
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard; 