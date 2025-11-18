import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import UserDashboard from './pages/user/Dashboard';
import ResumeBuilder from './pages/user/ResumeBuilder';
import AtsChecker from './pages/user/AtsChecker';
import Templates from './pages/user/Templates';
import Downloads from './pages/user/Downloads';
import UserProfile from './pages/user/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ResumeManagement from './pages/admin/ResumeManagement';
import TemplateManagement from './pages/admin/TemplateManagement';
import FeatureManagement from './pages/admin/FeatureManagement';
import AiMonitoring from './pages/admin/AiMonitoring';
import Messages from './pages/admin/Messages';
import Analytics from './pages/admin/Analytics';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* User protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute element={<UserDashboard />} allowedRoles={['user']} />} />
              <Route path="/resume/builder" element={<ProtectedRoute element={<ResumeBuilder />} allowedRoles={['user']} />} />
              <Route path="/resume/builder/:id" element={<ProtectedRoute element={<ResumeBuilder />} allowedRoles={['user']} />} />
              <Route path="/ats-checker" element={<ProtectedRoute element={<AtsChecker />} allowedRoles={['user']} />} />
              <Route path="/templates" element={<ProtectedRoute element={<Templates />} allowedRoles={['user']} />} />
              <Route path="/downloads" element={<ProtectedRoute element={<Downloads />} allowedRoles={['user']} />} />
              <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} allowedRoles={['user']} />} />
              
              {/* Admin protected routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin', 'superadmin']} />} />
              <Route path="/admin/users" element={<ProtectedRoute element={<UserManagement />} allowedRoles={['admin', 'superadmin']} />} />
              <Route path="/admin/resumes" element={<ProtectedRoute element={<ResumeManagement />} allowedRoles={['admin', 'superadmin']} />} />
              <Route path="/admin/templates" element={<ProtectedRoute element={<TemplateManagement />} allowedRoles={['admin', 'superadmin']} />} />
              <Route path="/admin/features" element={<ProtectedRoute element={<FeatureManagement />} allowedRoles={['admin', 'superadmin']} />} />
              <Route path="/admin/ai-monitoring" element={<ProtectedRoute element={<AiMonitoring />} allowedRoles={['admin', 'superadmin']} />} />
              <Route path="/admin/messages" element={<ProtectedRoute element={<Messages />} allowedRoles={['admin', 'superadmin']} />} />
              <Route path="/admin/analytics" element={<ProtectedRoute element={<Analytics />} allowedRoles={['admin', 'superadmin']} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;