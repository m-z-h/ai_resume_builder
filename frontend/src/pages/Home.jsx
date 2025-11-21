import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-down">
              <span className="block">AI-Powered Resume Builder</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl md:text-3xl font-light animate-fade-in-up">
              Create professional, ATS-friendly resumes in minutes with our AI-powered platform
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-100">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-bold rounded-full text-white bg-transparent hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-white to-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Why Choose Our Resume Builder?
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-2xl text-gray-600">
              Powerful features to help you land your dream job
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-8 transform transition-all duration-300 hover:scale-105">
                <div className="flow-root bg-white rounded-2xl px-8 pb-10 shadow-xl h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-110">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-2xl font-bold text-gray-900 tracking-tight">AI-Powered Content</h3>
                    <p className="mt-5 text-lg text-gray-600">
                      Generate professional resume content tailored to your experience and job role using advanced AI.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="pt-8 transform transition-all duration-300 hover:scale-105">
                <div className="flow-root bg-white rounded-2xl px-8 pb-10 shadow-xl h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-110">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-2xl font-bold text-gray-900 tracking-tight">ATS Optimization</h3>
                    <p className="mt-5 text-lg text-gray-600">
                      Ensure your resume passes through Applicant Tracking Systems with our built-in ATS checker and optimizer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-8 transform transition-all duration-300 hover:scale-105">
                <div className="flow-root bg-white rounded-2xl px-8 pb-10 shadow-xl h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-110">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-2xl font-bold text-gray-900 tracking-tight">Professional Templates</h3>
                    <p className="mt-5 text-lg text-gray-600">
                      Choose from a variety of ATS-friendly, professionally designed templates for any industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800">
        <div className="w-full py-16 px-4 sm:px-6 lg:px-8 lg:py-20 lg:flex lg:items-center lg:justify-between">
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              <span className="block">Ready to build your perfect resume?</span>
              <span className="block text-indigo-200 mt-2">Start your free trial today.</span>
            </h2>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="inline-flex rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-xl font-bold rounded-full text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;