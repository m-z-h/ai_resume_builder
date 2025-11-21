import React, { useState, useEffect } from 'react';

const AiMonitoring = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [aiUsageStats, setAiUsageStats] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: '0.00',
    totalTokens: 0
  });
  const [usageOverTime, setUsageOverTime] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [apiEndpoints, setApiEndpoints] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const data = generateMockData();
      setAiUsageStats(data.aiUsageStats);
      setUsageOverTime(data.usageOverTime);
      setTopUsers(data.topUsers);
      setApiEndpoints(data.apiEndpoints);
      
      setLoading(false);
    };

    fetchData();
  }, [timeRange]);

  const generateMockData = () => {
    // Generate usage data for the selected time range
    const usageData = [];
    const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const requests = Math.floor(Math.random() * 100) + 20;
      const tokens = Math.floor(Math.random() * 20000) + 5000;
      usageData.push({
        date: date.toISOString().split('T')[0],
        requests,
        tokens
      });
    }

    // Generate top users data
    const users = [
      { id: 1, name: 'John Doe', requests: Math.floor(Math.random() * 200) + 50, tokens: Math.floor(Math.random() * 50000) + 10000 },
      { id: 2, name: 'Jane Smith', requests: Math.floor(Math.random() * 150) + 40, tokens: Math.floor(Math.random() * 40000) + 8000 },
      { id: 3, name: 'Robert Johnson', requests: Math.floor(Math.random() * 120) + 30, tokens: Math.floor(Math.random() * 30000) + 6000 },
      { id: 4, name: 'Emily Davis', requests: Math.floor(Math.random() * 100) + 25, tokens: Math.floor(Math.random() * 25000) + 5000 },
      { id: 5, name: 'Michael Wilson', requests: Math.floor(Math.random() * 80) + 20, tokens: Math.floor(Math.random() * 20000) + 4000 }
    ];

    // Generate API endpoints data
    const endpoints = [
      { endpoint: '/api/ai/generate', requests: Math.floor(Math.random() * 500) + 200, successRate: Math.random() * 10 + 90 },
      { endpoint: '/api/ai/improveSection', requests: Math.floor(Math.random() * 600) + 250, successRate: Math.random() * 10 + 89 },
      { endpoint: '/api/ai/atsScore', requests: Math.floor(Math.random() * 400) + 150, successRate: Math.random() * 10 + 88 },
      { endpoint: '/api/ai/rewriteJobSpecific', requests: Math.floor(Math.random() * 300) + 100, successRate: Math.random() * 10 + 91 }
    ];

    return {
      aiUsageStats: {
        totalRequests: usageData.reduce((sum, day) => sum + day.requests, 0),
        successfulRequests: Math.floor(usageData.reduce((sum, day) => sum + day.requests, 0) * 0.95),
        failedRequests: Math.floor(usageData.reduce((sum, day) => sum + day.requests, 0) * 0.05),
        averageResponseTime: (Math.random() * 0.5 + 0.8).toFixed(2),
        totalTokens: usageData.reduce((sum, day) => sum + day.tokens, 0)
      },
      usageOverTime: usageData,
      topUsers: users,
      apiEndpoints: endpoints
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Monitoring</h1>
          <p className="mt-2 text-gray-600">Monitor AI usage and performance metrics</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['1d', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Requests</h3>
                <p className="text-2xl font-bold text-gray-900">{aiUsageStats.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Success Rate</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {aiUsageStats.totalRequests > 0 
                    ? ((aiUsageStats.successfulRequests / aiUsageStats.totalRequests) * 100).toFixed(1) 
                    : '0.0'}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Failed Requests</h3>
                <p className="text-2xl font-bold text-gray-900">{aiUsageStats.failedRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Avg. Response</h3>
                <p className="text-2xl font-bold text-gray-900">{aiUsageStats.averageResponseTime}s</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Tokens Used</h3>
                <p className="text-2xl font-bold text-gray-900">{aiUsageStats.totalTokens.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usage Over Time */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI Usage Over Time</h2>
            <div className="h-80">
              <div className="flex items-end h-64 space-x-2 mt-8">
                {usageOverTime.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="text-xs text-gray-500 mb-1">{day.date}</div>
                    <div 
                      className="w-full bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors"
                      style={{ height: `${(day.requests / Math.max(...usageOverTime.map(d => d.requests), 1)) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{day.requests}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* API Endpoints */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">API Endpoints</h2>
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{endpoint.endpoint}</span>
                    <span className="text-sm text-gray-500">{endpoint.requests} requests</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Success Rate</span>
                      <span className="font-medium text-gray-900">{endpoint.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${endpoint.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top Users */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Users</h2>
            <div className="space-y-4">
              {topUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user.requests} requests</div>
                    <div className="text-sm text-gray-500">{user.tokens.toLocaleString()} tokens</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Error Logs */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Errors</h2>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Rate limit exceeded</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">User ID: 12345 - Endpoint: /api/ai/generate</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Invalid input parameters</span>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">User ID: 67890 - Endpoint: /api/ai/improveSection</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Token limit exceeded</span>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">User ID: 54321 - Endpoint: /api/ai/atsScore</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiMonitoring;