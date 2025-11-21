import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const data = generateMockData();
      setAnalyticsData(data);
      
      setLoading(false);
    };

    fetchData();
  }, [timeRange]);

  const generateMockData = () => {
    // Generate mock analytics data
    const totalUsers = Math.floor(Math.random() * 5000) + 2000;
    const totalResumes = Math.floor(Math.random() * 10000) + 5000;
    const totalAtsChecks = Math.floor(Math.random() * 8000) + 3000;
    const totalAiUsage = Math.floor(Math.random() * 15000) + 8000;
    
    // Generate monthly user growth data
    const monthlyUsers = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const users = Math.floor(Math.random() * 150) + 50;
      monthlyUsers.push({ month, users });
    }
    
    // Generate popular templates data
    const popularTemplates = [
      { name: 'Professional', usage: Math.floor(Math.random() * 500) + 200 },
      { name: 'Creative', usage: Math.floor(Math.random() * 400) + 150 },
      { name: 'Minimalist', usage: Math.floor(Math.random() * 350) + 100 },
      { name: 'Executive', usage: Math.floor(Math.random() * 300) + 80 },
      { name: 'Modern', usage: Math.floor(Math.random() * 250) + 50 }
    ];
    
    // Generate job role trends data
    const jobRoleTrends = [
      { role: 'Software Engineer', count: Math.floor(Math.random() * 1000) + 500 },
      { role: 'Product Manager', count: Math.floor(Math.random() * 800) + 400 },
      { role: 'Data Analyst', count: Math.floor(Math.random() * 700) + 300 },
      { role: 'UX Designer', count: Math.floor(Math.random() * 600) + 250 },
      { role: 'Marketing Specialist', count: Math.floor(Math.random() * 500) + 200 },
      { role: 'Sales Representative', count: Math.floor(Math.random() * 400) + 150 },
      { role: 'HR Manager', count: Math.floor(Math.random() * 300) + 100 }
    ];

    return {
      totalUsers: totalUsers.toLocaleString(),
      totalResumes: totalResumes.toLocaleString(),
      totalAtsChecks: totalAtsChecks.toLocaleString(),
      totalAiUsage: totalAiUsage.toLocaleString(),
      monthlyUsers,
      popularTemplates,
      jobRoleTrends
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600 text-lg">Comprehensive analytics and insights</p>
          <div className="flex space-x-2 mt-4">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {loading || !analyticsData ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-md flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Total Resumes</h3>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalResumes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">ATS Checks</h3>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalAtsChecks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">AI Usage</h3>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalAiUsage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly User Growth */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly User Growth</h2>
                <div className="h-64 flex items-end space-x-2">
                  {analyticsData.monthlyUsers.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors"
                        style={{ height: `${(item.users / 150) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Templates */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Templates</h2>
                <div className="space-y-4">
                  {analyticsData.popularTemplates.map((template, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-10 text-sm font-medium text-gray-500">#{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{template.name}</p>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{template.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Role Trends */}
              <div className="bg-white shadow-xl rounded-2xl p-6 lg:col-span-2 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Role Trends</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resume Count
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analyticsData.jobRoleTrends.map((role, index) => {
                        const percentage = Math.round((role.count / parseInt(analyticsData.totalResumes.replace(/,/g, ''))) * 100);
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{role.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{role.count}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-indigo-600 h-2.5 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-500">{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;