import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock template data - in a real app this would come from an API
  const mockTemplates = [
    {
      id: 1,
      name: 'Professional',
      category: 'business',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531cd7aca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
      description: 'Clean and professional design perfect for corporate environments',
      atsScore: 95,
      isPremium: false
    },
    {
      id: 2,
      name: 'Creative',
      category: 'design',
      thumbnail: 'https://images.unsplash.com/photo-1544731612-de7f21f69868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
      description: 'Modern and creative layout for design professionals',
      atsScore: 88,
      isPremium: true
    },
    {
      id: 3,
      name: 'Minimalist',
      category: 'business',
      thumbnail: 'https://images.unsplash.com/photo-1586281380128-cd207e631d87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
      description: 'Simple and elegant design focusing on content',
      atsScore: 92,
      isPremium: false
    },
    {
      id: 4,
      name: 'Executive',
      category: 'business',
      thumbnail: 'https://images.unsplash.com/photo-1586281380129-cd207e631d87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
      description: 'Sophisticated design for senior professionals',
      atsScore: 90,
      isPremium: true
    },
    {
      id: 5,
      name: 'Tech',
      category: 'technology',
      thumbnail: 'https://images.unsplash.com/photo-1586281380130-cd207e631d87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
      description: 'Modern design perfect for technology professionals',
      atsScore: 94,
      isPremium: false
    },
    {
      id: 6,
      name: 'Academic',
      category: 'education',
      thumbnail: 'https://images.unsplash.com/photo-1586281380131-cd207e631d87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80',
      description: 'Traditional academic style for educators and researchers',
      atsScore: 87,
      isPremium: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'business', name: 'Business' },
    { id: 'technology', name: 'Technology' },
    { id: 'design', name: 'Design' },
    { id: 'education', name: 'Education' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTemplates(mockTemplates);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Resume Templates</h1>
          <p className="mt-2 text-gray-600 text-lg">Choose from our professionally designed templates</p>
        </div>

        {/* Filters */};
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-bold text-gray-700 mb-2">
                Search Templates
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search by name or description"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 pl-10 transition-all duration-300 hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md appearance-none bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
              <div className="relative">
                <img 
                  src={template.thumbnail} 
                  alt={template.name} 
                  className="w-full h-48 object-cover"
                />
                {template.isPremium && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    PREMIUM
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm text-gray-900 font-bold px-3 py-1 rounded-full">
                  ATS Score: {template.atsScore}%
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800 capitalize">
                    {template.category}
                  </span>
                  <Link 
                    to={`/resume/builder?template=${template.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No templates found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* ATS Tips */}
        <div className="mt-16 bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">ATS Optimization Tips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Maximize your chances of passing through Applicant Tracking Systems with these expert tips
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-2xl p-5">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Use Standard Section Headers</h3>
              <p className="text-gray-600">Use common section headers like "Experience", "Education", and "Skills" to ensure ATS can parse your resume correctly.</p>
            </div>
            
            <div className="border border-gray-200 rounded-2xl p-5">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Incorporate Relevant Keywords</h3>
              <p className="text-gray-600">Incorporate relevant keywords from the job description to improve your match score.</p>
            </div>
            
            <div className="border border-gray-200 rounded-2xl p-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Section Headers</h3>
              <p className="text-gray-600">Use clear section headers like "Experience" and "Education" to help ATS parse your resume.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;