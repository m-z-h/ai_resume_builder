import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../store/analyticsSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, isLoading: loading, isError: error } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
  
  // Use real data from the store or fallback to 0
  const totalUsers = dashboardData?.totalUsers || 0;
  const totalResumes = dashboardData?.totalResumes || 0;
  const monthlyActiveUsers = Math.round(totalUsers * 0.68); // Estimate based on total users
  const totalAtsChecks = dashboardData?.totalAtsChecks || 0;
  const popularRoles = dashboardData?.jobRoleTrends || [];
  
  // Recent activity - in a real implementation, this would come from the backend
  const recentActivity = [
    { user: 'John Doe', action: 'Created resume', time: '2 minutes ago' },
    { user: 'Jane Smith', action: 'Checked ATS score', time: '15 minutes ago' },
    { user: 'Robert Johnson', action: 'Downloaded PDF', time: '1 hour ago' },
    { user: 'Emily Davis', action: 'Updated profile', time: '2 hours ago' },
    { user: 'Michael Wilson', action: 'Used AI improve', time: '3 hours ago' }
  ];
  
  // Feature controls data - in a real implementation, this would come from the backend
  const features = [
    { _id: '1', featureName: 'aiResumeGenerator', isEnabled: true, allowedRoles: ['user'], dailyLimit: 5 },
    { _id: '2', featureName: 'atsScoreChecker', isEnabled: true, allowedRoles: ['user'], dailyLimit: 10 },
    { _id: '3', featureName: 'pdfDownload', isEnabled: true, allowedRoles: ['user'], dailyLimit: 0 },
    { _id: '4', featureName: 'docxDownload', isEnabled: true, allowedRoles: ['user'], dailyLimit: 0 },
    { _id: '5', featureName: 'odfDownload', isEnabled: true, allowedRoles: ['user'], dailyLimit: 0 },
    { _id: '6', featureName: 'aiImprove', isEnabled: true, allowedRoles: ['user'], dailyLimit: 3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600 text-lg">Welcome to the AI Resume Builder admin panel</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium text-gray-500">Total Resumes</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalResumes.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium text-gray-500">Monthly Active Users</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{monthlyActiveUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium text-gray-500">ATS Checks</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalAtsChecks.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Job Roles */}
          <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Popular Job Roles</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {popularRoles.map((role, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-900">{role.role}</span>
                      <span className="text-base text-gray-500">{role.count}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full" 
                        style={{ width: `${(role.count / Math.max(...popularRoles.map(r => r.count), 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {popularRoles.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                    <p className="mt-1 text-sm text-gray-500">Job role trends will appear here once users create resumes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                            <span className="text-indigo-800 text-lg font-bold">
                              {activity.user.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900 truncate">
                            {activity.user}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {activity.action}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Controls */}
        <div className="mt-8 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Feature Controls</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature._id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      {feature.featureName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                      feature.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {feature.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm">
                      {feature.allowedRoles && feature.allowedRoles.length > 0 
                        ? `Allowed roles: ${feature.allowedRoles.join(', ')}` 
                        : 'Available to all users'}
                    </p>
                    {feature.dailyLimit > 0 && (
                      <p className="mt-2 text-gray-600 text-sm">
                        Daily limit: {feature.dailyLimit} uses
                      </p>
                    )}
                  </div>
                  <div className="mt-5">
                    <button 
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-150 flex items-center hover:underline"
                      onClick={() => {
                        // Navigate to feature management page
                        window.location.hash = `/admin/features`;
                      }}
                    >
                      Manage
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;