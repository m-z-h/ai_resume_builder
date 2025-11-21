import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-down">
              <span className="block">About AI Resume Builder</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl md:text-3xl font-light animate-fade-in-up">
              Revolutionizing the job search process with AI-powered resume creation
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gradient-to-br from-white to-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-base text-indigo-600 font-bold tracking-wide uppercase mb-4">Our Mission</h2>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Empowering Job Seekers Worldwide
            </p>
            <p className="mt-6 max-w-3xl mx-auto text-2xl text-gray-600">
              We believe that everyone deserves a fair chance at their dream job. Our AI-powered platform helps bridge the gap between talented professionals and their ideal career opportunities.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="text-indigo-600 mb-6">
                  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ATS Optimization</h3>
                <p className="text-lg text-gray-600">
                  Our platform ensures your resume passes through Applicant Tracking Systems with flying colors, increasing your chances of getting noticed by recruiters.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="text-indigo-600 mb-6">
                  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Content</h3>
                <p className="text-lg text-gray-600">
                  Leverage artificial intelligence to create compelling resume content that highlights your skills and achievements in the best possible light.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
                <div className="text-indigo-600 mb-6">
                  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Approach</h3>
                <p className="text-lg text-gray-600">
                  Customize your resume for different job roles and industries with our role-specific tools and templates designed for maximum impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why AI Resumes Section */}
      <div className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-base text-indigo-600 font-bold tracking-wide uppercase mb-4">Why AI Resumes?</h2>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              The Future of Resume Writing
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-12">
              <div className="relative bg-gray-50 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <div className="absolute flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="ml-24 text-2xl font-bold text-gray-900 mb-3">Faster Creation</p>
                <p className="ml-24 text-lg text-gray-600">
                  Create a professional resume in minutes instead of hours, allowing you to focus on your job search.
                </p>
              </div>

              <div className="relative bg-gray-50 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <div className="absolute flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="ml-24 text-2xl font-bold text-gray-900 mb-3">ATS Compliant</p>
                <p className="ml-24 text-lg text-gray-600">
                  Our AI ensures your resume is optimized for Applicant Tracking Systems used by 99% of Fortune 500 companies.
                </p>
              </div>

              <div className="relative bg-gray-50 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <div className="absolute flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-24 text-2xl font-bold text-gray-900 mb-3">Time Saving</p>
                <p className="ml-24 text-lg text-gray-600">
                  Spend less time formatting and more time preparing for interviews with our intuitive builder.
                </p>
              </div>

              <div className="relative bg-gray-50 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <div className="absolute flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className="ml-24 text-2xl font-bold text-gray-900 mb-3">Keyword Optimization</p>
                <p className="ml-24 text-lg text-gray-600">
                  Automatically identify and incorporate industry-specific keywords to pass ATS filters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800">
        <div className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto lg:py-20 lg:flex lg:items-center lg:justify-between">
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              <span className="block">Ready to build your future?</span>
              <span className="block text-indigo-200 mt-2">Start your journey today.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-end gap-4">
            <div className="inline-flex rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-xl font-bold rounded-full text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get started
              </Link>
            </div>
            <div className="inline-flex rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 border border-white text-xl font-bold rounded-full text-white bg-transparent hover:bg-white hover:bg-opacity-10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;