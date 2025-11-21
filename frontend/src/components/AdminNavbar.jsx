import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-700 shadow-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin/dashboard" className="text-3xl font-bold text-white flex items-center group">
                <svg className="h-10 w-10 mr-3 text-white group-hover:text-indigo-200 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  AI Resume Builder Admin
                </span>
              </Link>
            </div>
            <div className="hidden lg:ml-10 lg:flex lg:space-x-6">
              <Link to="/admin/dashboard" className="text-white hover:bg-white/20 px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-indigo-100 hover:bg-white/20 hover:text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Users
              </Link>
              <Link to="/admin/resumes" className="text-indigo-100 hover:bg-white/20 hover:text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Resumes
              </Link>
              <Link to="/admin/templates" className="text-indigo-100 hover:bg-white/20 hover:text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Templates
              </Link>
              <Link to="/admin/features" className="text-indigo-100 hover:bg-white/20 hover:text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Features
              </Link>
              <Link to="/admin/messages" className="text-indigo-100 hover:bg-white/20 hover:text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Messages
              </Link>
              <Link to="/admin/analytics" className="text-indigo-100 hover:bg-white/20 hover:text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Analytics
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center">
            <div className="ml-3 relative flex items-center space-x-6">
              <span className="text-lg text-white font-medium bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                Admin: {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-lg font-bold bg-white text-indigo-800 hover:bg-indigo-100 px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="-mr-2 flex items-center lg:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-white hover:text-indigo-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-indigo-900/95 backdrop-blur-lg">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
            <Link to="/admin/dashboard" className="text-white block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 transition-colors duration-300">
              Dashboard
            </Link>
            <Link to="/admin/users" className="text-indigo-100 block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 hover:text-white transition-colors duration-300">
              Users
            </Link>
            <Link to="/admin/resumes" className="text-indigo-100 block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 hover:text-white transition-colors duration-300">
              Resumes
            </Link>
            <Link to="/admin/templates" className="text-indigo-100 block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 hover:text-white transition-colors duration-300">
              Templates
            </Link>
            <Link to="/admin/features" className="text-indigo-100 block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 hover:text-white transition-colors duration-300">
              Features
            </Link>
            <Link to="/admin/messages" className="text-indigo-100 block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 hover:text-white transition-colors duration-300">
              Messages
            </Link>
            <Link to="/admin/analytics" className="text-indigo-100 block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 hover:text-white transition-colors duration-300">
              Analytics
            </Link>
            <div className="pt-4 pb-3 border-t border-indigo-800">
              <div className="flex items-center px-5">
                <div className="flex items-center justify-between w-full">
                  <span className="text-base text-white font-medium bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                    Admin: {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-base font-bold bg-white text-indigo-800 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;