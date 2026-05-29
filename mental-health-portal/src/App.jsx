import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Resources from './pages/Resources/Resources';
import Counseling from './pages/Counseling/Counseling';
import Assessment from './pages/Assessment/Assessment';
import Profile from './pages/Profile/Profile';
import MoodTracker from './components/MoodTracker/MoodTracker';
import Chatbot from './components/Chatbot/Chatbot';
import Exercises from './pages/Exercises/Exercises';
import About from './pages/About/About';
import Emergency from './pages/Emergency/Emergency';
import Journal from './pages/Journal/Journal';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CounselorDashboard from './pages/CounselorDashboard/CounselorDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import VideoRoom from './pages/VideoRoom/VideoRoom';
import { useAuth } from './context/AuthContext';

// Wrapper that redirects already-logged-in users away from auth pages
const AuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    if (user?.role === 'counselor') return <Navigate to="/counselor-dashboard" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const { logout, isAuthenticated } = useAuth();

  // Initial session verification
  React.useEffect(() => {
    const token = sessionStorage.getItem('token');
    // If we have no token but think we are authenticated, force a cleanup
    if (!token && isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/resources" element={<Resources />} />

            {/* Auth Routes — redirect if already logged in */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
            <Route path="/ai-support" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/counseling" element={<ProtectedRoute><Counseling /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/counselor-dashboard" element={<ProtectedRoute><CounselorDashboard /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/video-room" element={<ProtectedRoute><VideoRoom /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
