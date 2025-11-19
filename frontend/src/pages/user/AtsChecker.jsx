import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AtsChecker = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [atsReport, setAtsReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real implementation, this would call the backend API
    // For now, we'll simulate a response
    setTimeout(() => {
      setAtsReport({
        overallScore: 85,
        keywordMatch: {
          score: 90,
          matchedKeywords: ["JavaScript", "React", "Node.js"],
          missingKeywords: ["TypeScript", "AWS", "Docker"]
        },
        formatting: {
          score: 80,
          issues: ["Inconsistent bullet points", "Missing metrics"],
          suggestions: ["Standardize bullet points", "Add quantifiable metrics"]
        },
        actionVerbs: {
          score: 75,
          usedVerbs: ["managed", "developed"],
          suggestedVerbs: ["orchestrated", "pioneered", "optimized"]
        },
        skillAnalysis: {
          hardSkills: {
            score: 88,
            identified: ["JavaScript", "React", "Node.js", "MongoDB"]
          },
          softSkills: {
            score: 70,
            identified: ["Leadership", "Communication"]
          }
        },
        lengthCheck: {
          score: 95,
          currentPageCount: 1,
          recommendedPageCount: 1
        },
        weakSentences: [
          {
            sentence: "Responsible for development tasks",
            suggestions: ["Add specific technologies", "Include measurable outcomes"]
          }
        ],
        detailedFeedback: "Your resume is well-structured and includes relevant keywords. To improve further, add more quantifiable metrics and include the missing technical keywords."
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ATS Score Checker</h1>
          <p className="mt-2 text-gray-600">Upload your resume and check its compatibility with Applicant Tracking Systems</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Check Your Resume</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume
                  </label>
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                  {resumeFile && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                    placeholder="Paste the job description to tailor your resume..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !resumeFile}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading || !resumeFile 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    'Check ATS Score'
                  )}
                </button>
              </form>
            </div>
            
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">How ATS Works</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Scans for relevant keywords from job descriptions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Evaluates formatting for readability</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Checks for appropriate action verbs</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Analyzes skill matching</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="lg:col-span-2">
            {atsReport ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">ATS Compatibility Score</h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(atsReport.overallScore)}`}>
                      <span className={`text-lg font-bold ${getScoreColor(atsReport.overallScore)}`}>
                        {atsReport.overallScore}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full ${
                          atsReport.overallScore >= 80 ? 'bg-green-500' : 
                          atsReport.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${atsReport.overallScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-600">{atsReport.detailedFeedback}</p>
                  </div>
                </div>
                
                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Keyword Match */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Keyword Match</h3>
                    <div className="flex items-center mb-3">
                      <span className={`text-2xl font-bold ${getScoreColor(atsReport.keywordMatch.score)}`}>
                        {atsReport.keywordMatch.score}%
                      </span>
                      <span className="ml-2 text-sm text-gray-500">Matched</span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Matched Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {atsReport.keywordMatch.matchedKeywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {atsReport.keywordMatch.missingKeywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Formatting */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Formatting</h3>
                    <div className="flex items-center mb-3">
                      <span className={`text-2xl font-bold ${getScoreColor(atsReport.formatting.score)}`}>
                        {atsReport.formatting.score}%
                      </span>
                      <span className="ml-2 text-sm text-gray-500">Compliant</span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Issues Found</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {atsReport.formatting.issues.map((issue, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-4 w-4 text-red-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Suggestions</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {atsReport.formatting.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Action Verbs */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Action Verbs</h3>
                    <div className="flex items-center mb-3">
                      <span className={`text-2xl font-bold ${getScoreColor(atsReport.actionVerbs.score)}`}>
                        {atsReport.actionVerbs.score}%
                      </span>
                      <span className="ml-2 text-sm text-gray-500">Strength</span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Used Verbs</h4>
                      <div className="flex flex-wrap gap-2">
                        {atsReport.actionVerbs.usedVerbs.map((verb, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {verb}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Suggested Verbs</h4>
                      <div className="flex flex-wrap gap-2">
                        {atsReport.actionVerbs.suggestedVerbs.map((verb, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {verb}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Skills Analysis */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Skills Analysis</h3>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Hard Skills</span>
                        <span className={`text-sm font-medium ${getScoreColor(atsReport.skillAnalysis.hardSkills.score)}`}>
                          {atsReport.skillAnalysis.hardSkills.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500" 
                          style={{ width: `${atsReport.skillAnalysis.hardSkills.score}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {atsReport.skillAnalysis.hardSkills.identified.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Soft Skills</span>
                        <span className={`text-sm font-medium ${getScoreColor(atsReport.skillAnalysis.softSkills.score)}`}>
                          {atsReport.skillAnalysis.softSkills.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-purple-500" 
                          style={{ width: `${atsReport.skillAnalysis.softSkills.score}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {atsReport.skillAnalysis.softSkills.identified.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Weak Sentences */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Weak Sentences Identified</h3>
                  <div className="space-y-4">
                    {atsReport.weakSentences.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-800 italic">"{item.sentence}"</p>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-700">Suggestions:</h4>
                          <ul className="mt-1 text-sm text-gray-600 space-y-1">
                            {item.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start">
                                <svg className="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* AI Improvement Button */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Improve Your Resume</h3>
                  <p className="text-gray-600 mb-4">Use our AI-powered tool to automatically fix issues and optimize your resume for this job.</p>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Auto-Improve with AI
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Check Your Resume</h3>
                <p className="mt-1 text-gray-500">Upload your resume to get an instant ATS compatibility score and detailed feedback.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsChecker;