import React, { useState } from 'react';

const AtsChecker = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || 
          droppedFile.type === 'application/msword' ||
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(droppedFile);
      } else {
        alert('Please upload a PDF, DOC, or DOCX file');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/msword' ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
      } else {
        alert('Please upload a PDF, DOC, or DOCX file');
      }
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        score: 85,
        keywords: [
          { word: 'JavaScript', found: true },
          { word: 'React', found: true },
          { word: 'Node.js', found: false },
          { word: 'HTML', found: true },
          { word: 'CSS', found: true },
          { word: 'MongoDB', found: false }
        ],
        suggestions: [
          'Add more technical keywords relevant to the job description',
          'Include specific metrics and achievements in your experience section',
          'Ensure your contact information is clearly visible',
          'Use standard section headers like "Experience" and "Education"'
        ],
        improvements: [
          'Your resume is well-formatted and should parse correctly in most ATS systems',
          'Consider adding Node.js and MongoDB to match more job descriptions',
          'Your keyword match rate is strong at 67%'
        ]
      };
      
      setAnalysisResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">ATS Resume Checker</h1>
          <p className="mt-2 text-gray-600 text-lg">Check if your resume is optimized for Applicant Tracking Systems</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Upload Your Resume</h2>
              </div>
              <div className="p-6">
                {!analysisResult ? (
                  <>
                    <div 
                      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                        isDragging 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {file ? file.name : 'Drag & drop your resume here'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {file ? 'Click to change file' : 'Supports PDF, DOC, and DOCX formats'}
                        </p>
                        <button
                          type="button"
                          className="inline-flex items-center px-5 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                        >
                          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Select File
                        </button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          'Analyze Resume'
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h3>
                      <p className="text-gray-600 mb-6">Your resume has been successfully analyzed</p>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center px-5 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Check Another Resume
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Info Panel */}
          <div>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h2 className="text-xl font-bold text-gray-900">How ATS Works</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">1</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-bold text-gray-900">Parsing</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        ATS software scans your resume and extracts text content, ignoring graphics and complex formatting.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">2</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-bold text-gray-900">Keyword Matching</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        The system matches keywords from your resume with those in the job description to determine relevance.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-sm">3</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-bold text-gray-900">Scoring</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Based on keyword matches and formatting, your resume receives a score that determines if it moves forward.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">ATS Optimization Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">Use standard fonts like Arial or Calibri</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">Include relevant keywords from job descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">Use clear section headers like "Experience" and "Education"</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600">Save in PDF format to preserve formatting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-8 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
            </div>
            <div className="p-6">
              {/* Score */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <svg className="w-48 h-48" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={analysisResult.score >= 80 ? "#10B981" : analysisResult.score >= 60 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="3"
                      strokeDasharray={`${analysisResult.score}, 100`}
                    />
                    <text x="18" y="20.5" textAnchor="middle" fill="#1F2937" fontSize="8" fontWeight="bold">
                      {analysisResult.score}%
                    </text>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-4">
                  {analysisResult.score >= 80 ? 'Excellent!' : analysisResult.score >= 60 ? 'Good' : 'Needs Improvement'}
                </h3>
                <p className="text-gray-600 mt-2">
                  {analysisResult.score >= 80 
                    ? 'Your resume is well-optimized for ATS systems' 
                    : analysisResult.score >= 60 
                      ? 'Your resume has good ATS compatibility' 
                      : 'Your resume needs some improvements for ATS compatibility'}
                </p>
              </div>
              
              {/* Keywords */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Keyword Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResult.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        keyword.found ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {keyword.found ? (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className={`font-bold ${keyword.found ? 'text-green-800' : 'text-red-800'}`}>
                          {keyword.word}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Suggestions */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Suggestions</h3>
                <div className="space-y-3">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Improvements */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Improvements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisResult.improvements.map((improvement, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <p className="text-gray-700">{improvement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtsChecker;