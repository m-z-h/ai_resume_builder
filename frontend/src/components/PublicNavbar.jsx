import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 shadow-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-3xl font-bold text-white flex items-center group">
                <svg className="h-10 w-10 mr-3 text-white group-hover:text-indigo-200 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                  AI Resume Builder
                </span>
              </Link>
            </div>
            <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
              <Link to="/" className="text-white hover:bg-white/20 px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Home
              </Link>
              <Link to="/about" className="text-indigo-100 hover:bg-white/20 hover:text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                About
              </Link>
              <Link to="/contact" className="text-indigo-100 hover:bg-white/20 hover:text-white px-4 py-2 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center">
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-lg font-bold text-white hover:text-indigo-200 px-5 py-2 rounded-full transition-all duration-300 hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-lg font-bold bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign up
              </Link>
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
        <div className="lg:hidden bg-indigo-800/95 backdrop-blur-lg">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
            <Link to="/" className="text-white block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 transition-colors duration-300">
              Home
            </Link>
            <Link to="/about" className="text-indigo-100 block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 hover:text-white transition-colors duration-300">
              About
            </Link>
            <Link to="/contact" className="text-indigo-100 block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/20 hover:text-white transition-colors duration-300">
              Contact
            </Link>
            <div className="pt-4 pb-3 border-t border-indigo-700">
              <div className="flex items-center px-5">
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-base font-bold text-white hover:text-indigo-200 px-4 py-2 rounded-xl transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="text-base font-bold bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;