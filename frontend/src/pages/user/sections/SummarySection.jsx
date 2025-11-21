import React, { useState } from 'react';
import AIGenerateButton from '../../../components/AIGenerateButton';
import axios from 'axios';

const SummarySection = ({ resumeData, setResumeData }) => {
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, summary: value }
    }));
  };

  const generateAISummary = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/generateSummary',
        {
          personalInfo: resumeData.personalInfo,
          experience: resumeData.experience,
          skills: resumeData.skills
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        handleChange(response.data.data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
        <AIGenerateButton onClick={generateAISummary} loading={aiLoading} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
        <textarea
          rows={6}
          value={resumeData.personalInfo.summary}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="A brief summary of your professional background, skills, and career goals..."
        ></textarea>
        <p className="mt-2 text-sm text-gray-500">Write 2-3 sentences highlighting your key strengths and career focus, or use AI to generate one.</p>
      </div>
    </div>
  );
};

export default SummarySection;
