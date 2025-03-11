import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get user display name and avatar
  const getUserName = () => {
    if (!currentUser) return '';
    
    // Try to get name from user metadata
    if (currentUser.user_metadata?.full_name) {
      return currentUser.user_metadata.full_name;
    }
    
    // Fallback to email
    return currentUser.email?.split('@')[0] || 'User';
  };
  
  const getUserAvatar = () => {
    if (!currentUser) return '';
    
    // Try to get avatar from user metadata
    if (currentUser.user_metadata?.avatar_url) {
      return currentUser.user_metadata.avatar_url;
    }
    
    // Generate avatar from name
    const name = getUserName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">LeetUIUX</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/challenges" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
              Challenges
            </Link>
            <Link to="/submissions" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
              All Submissions
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <input
              type="text"
              placeholder="Search challenges..."
              className="h-10 w-64 rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          {isAuthenticated() ? (
            <>
              <Link to="/notifications" className="relative inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-transparent bg-transparent hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  3
                </span>
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-transparent bg-transparent hover:bg-gray-100"
                >
                  <img 
                    src={getUserAvatar()} 
                    alt={getUserName()} 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/my-submissions"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Submissions
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-transparent bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </div>
          )}
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 border border-transparent bg-transparent hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/challenges"
              className="block py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Challenges
            </Link>
            {isAuthenticated() && (
              <>
                <Link
                  to="/submissions"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Submissions
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/notifications"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notifications
                </Link>
                <Link
                  to="/my-submissions"
                  className="block py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Submissions
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                >
                  Sign out
                </button>
              </>
            )}
            {!isAuthenticated() && (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-transparent bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 