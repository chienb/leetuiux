import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ChallengesPage from './pages/ChallengesPage';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import ChallengeSubmitPage from './pages/ChallengeSubmitPage';
import ProfilePage from './pages/ProfilePage';
import SubmissionsPage from './pages/SubmissionsPage';
import MySubmissionsPage from './pages/MySubmissionsPage';
import SubmissionDetailPage from './pages/SubmissionDetailPage';
import NotificationsPage from './pages/NotificationsPage';
import BadgesPage from './pages/BadgesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/challenge-detail/:id" element={<ChallengeDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/submission-detail/:id" element={<SubmissionDetailPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/challenge-submit/:id" 
                element={
                  <ProtectedRoute>
                    <ChallengeSubmitPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-submissions" 
                element={
                  <ProtectedRoute>
                    <MySubmissionsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/badges" 
                element={
                  <ProtectedRoute>
                    <BadgesPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
