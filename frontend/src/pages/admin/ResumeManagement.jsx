import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Get user token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const ResumeManagement = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalResumes: 0,
    limit: 10
  });

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = getToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('/api/resumes/admin/all', config);
        setResumes(response.data.resumes);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPages,
          totalResumes: response.data.totalResumes,
          page: response.data.currentPage
        });
      } catch (error) {
        console.error('Error fetching resumes:', error);
        // Check if it's a 403 error (Forbidden)
        if (error.response && error.response.status === 403) {
          setError('Access denied. You must be an administrator to view this page.');
        } else {
          setError('Failed to load resumes. Please try again later.');
        }
        // Fallback to mock data if API call fails
        setResumes([
          { _id: 1, title: 'Software Engineer Resume', user: 'John Doe', createdAt: '2023-05-10', updatedAt: '2023-05-15', atsScore: 85, status: 'published' },
          { _id: 2, title: 'Product Manager CV', user: 'Jane Smith', createdAt: '2023-05-12', updatedAt: '2023-05-14', atsScore: 72, status: 'draft' },
          { _id: 3, title: 'Data Analyst Resume', user: 'Robert Johnson', createdAt: '2023-05-08', updatedAt: '2023-05-16', atsScore: 91, status: 'published' },
          { _id: 4, title: 'UX Designer Portfolio', user: 'Emily Davis', createdAt: '2023-05-05', updatedAt: '2023-05-10', atsScore: 68, status: 'published' },
          { _id: 5, title: 'Marketing Specialist Resume', user: 'Michael Wilson', createdAt: '2023-05-01', updatedAt: '2023-05-03', atsScore: 79, status: 'draft' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleStatusChange = async (resumeId, newStatus) => {
    try {
      const token = getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Update resume status on backend
      await axios.put(`/api/resumes/${resumeId}`, 
        { isPublished: newStatus === 'published' }, 
        config
      );

      // Update local state
      setResumes(resumes.map(resume => 
        resume._id === resumeId ? { ...resume, status: newStatus } : resume
      ));
    } catch (error) {
      console.error('Error updating resume status:', error);
      setError('Failed to update resume status');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Resume Management</h1>
          <p className="mt-2 text-gray-600 text-lg">Manage all user resumes and their visibility</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-bold text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Title or user"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Data
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a7.962 7.962 0 014 0l3-2.647A7.962 7.962 0 0116 12H4c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-bold text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {/* Resumes Table */}
        {!loading && (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Resumes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Resume
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      ATS Score
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resumes.map((resume) => (
                    <tr key={resume._id} className="hover:bg-gray-50 transition-all duration-150">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-base font-bold text-gray-900">{resume.title}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-base font-medium text-gray-900">{resume.user}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                        {formatDate(resume.createdAt)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                        {formatDate(resume.updatedAt)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${
                          resume.atsScore >= 80 ? 'bg-green-100 text-green-800' :
                          resume.atsScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {resume.atsScore}/100
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${
                          resume.status === 'published' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {resume.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button className="text-indigo-600 hover:text-indigo-900 font-bold transition-colors duration-150">
                            View
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900 font-bold transition-colors duration-150">
                            Edit
                          </button>
                          {resume.status === 'published' ? (
                            <button 
                              onClick={() => handleStatusChange(resume._id, 'draft')}
                              className="text-yellow-600 hover:text-yellow-900 font-bold transition-colors duration-150"
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusChange(resume._id, 'published')}
                              className="text-green-600 hover:text-green-900 font-bold transition-colors duration-150"
                            >
                              Publish
                            </button>
                          )}
                          <button className="text-red-600 hover:text-red-900 font-bold transition-colors duration-150">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-6 py-5 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-5 py-3 border border-gray-300 text-base font-bold rounded-xl ${
                    pagination.page === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300'
                  }`}
                >
                  Previous
                </button>
                <button 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`ml-3 relative inline-flex items-center px-5 py-3 border border-gray-300 text-base font-bold rounded-xl ${
                    pagination.page === pagination.totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-base text-gray-700">
                    Showing <span className="font-bold">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-bold">{Math.min(pagination.page * pagination.limit, pagination.totalResumes)}</span> of{' '}
                    <span className="font-bold">{pagination.totalResumes}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`relative inline-flex items-center px-3 py-3 rounded-l-xl border border-gray-300 text-base font-bold ${
                        pagination.page === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-500 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-5 py-3 border text-base font-bold ${
                            pageNum === pagination.page
                              ? 'z-10 bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-500 text-white shadow-lg'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className={`relative inline-flex items-center px-3 py-3 rounded-r-xl border border-gray-300 text-base font-bold ${
                        pagination.page === pagination.totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-500 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeManagement;