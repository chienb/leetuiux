import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Improve Your UI/UX Design Skills Through Practice</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            LeetUIUX offers real-world design challenges to help you build your portfolio, get feedback from peers, and level up your design skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/challenges" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-6 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Browse Challenges
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-6 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why LeetUIUX?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                  <path d="M13 5v2"></path>
                  <path d="M13 17v2"></path>
                  <path d="M13 11v2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-world Challenges</h3>
              <p className="text-gray-600">
                Practice with design challenges inspired by real-world scenarios that companies face every day.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M12 18v-6"></path>
                  <path d="M8 15h8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Your Portfolio</h3>
              <p className="text-gray-600">
                Showcase your solutions and build a portfolio of work that demonstrates your design skills to potential employers.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Feedback</h3>
              <p className="text-gray-600">
                Get constructive feedback from peers and industry professionals to improve your design skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Challenges Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Recent Challenges</h2>
            <Link to="/challenges" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all challenges →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Challenge Card 1 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">E-commerce Product Page Redesign</h3>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Easy
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Redesign a product page for an e-commerce website to improve user experience and conversion rates.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Submissions: 128</span>
                  </div>
                  <Link to="/challenge-detail" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    View challenge →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Challenge Card 2 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Mobile Banking App Dashboard</h3>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Medium
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Design a user-friendly dashboard for a mobile banking application that displays key financial information.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Submissions: 86</span>
                  </div>
                  <Link to="/challenge-detail" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    View challenge →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Challenge Card 3 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">SaaS Analytics Dashboard</h3>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Hard
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Create a comprehensive analytics dashboard for a SaaS platform that visualizes complex data in an intuitive way.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Submissions: 42</span>
                  </div>
                  <Link to="/challenge-detail" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    View challenge →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to improve your UI/UX design skills?</h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
            Join thousands of designers who are leveling up their skills with LeetUIUX challenges.
          </p>
          <Link to="/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-6 bg-white text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" className="h-12 w-12 rounded-full" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">UI Designer at Dropbox</p>
                </div>
              </div>
              <p className="text-gray-600">
                "LeetUIUX challenges helped me prepare for my design interviews and land my dream job. The real-world scenarios are exactly what companies are looking for."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="User" className="h-12 w-12 rounded-full" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Michael Chen</h3>
                  <p className="text-sm text-gray-600">Product Designer at Airbnb</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The feedback I received on my submissions was invaluable. It helped me identify blind spots in my design process and improve my skills significantly."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="User" className="h-12 w-12 rounded-full" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Emily Rodriguez</h3>
                  <p className="text-sm text-gray-600">UX Designer at Google</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a self-taught designer, LeetUIUX provided the structure and challenges I needed to build a portfolio that showcases my skills to potential employers."
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 