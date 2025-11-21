import React, { useState } from 'react';
import AIGenerateButton from '../../../components/AIGenerateButton';
import axios from 'axios';

const ExperienceSection = ({ resumeData, setResumeData }) => {
  const [aiLoading, setAiLoading] = useState(null);

  const handleChange = (index, field, value) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setResumeData(prev => ({ ...prev, experience: newExperience }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '', achievements: [] }]
    }));
  };

  const removeExperience = (index) => {
    const newExperience = [...resumeData.experience];
    newExperience.splice(index, 1);
    setResumeData(prev => ({ ...prev, experience: newExperience }));
  };

  const generateDescription = async (index) => {
    setAiLoading(index);
    try {
      const exp = resumeData.experience[index];
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/generateExperienceDescription',
        { jobTitle: exp.position, company: exp.company, responsibilities: exp.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        handleChange(index, 'description', response.data.data.bulletPoints.join('\n• '));
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
        <button onClick={addExperience} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Experience</button>
      </div>
      <div className="space-y-6">
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input type="text" value={exp.position} onChange={(e) => handleChange(index, 'position', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Software Engineer" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                <input type="text" value={exp.company} onChange={(e) => handleChange(index, 'company', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Company Name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input type="month" value={exp.startDate} onChange={(e) => handleChange(index, 'startDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input type="month" value={exp.endDate} onChange={(e) => handleChange(index, 'endDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" disabled={exp.isCurrent} />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <AIGenerateButton onClick={() => generateDescription(index)} loading={aiLoading === index} text="Generate Description" />
              </div>
              <textarea rows={4} value={exp.description} onChange={(e) => handleChange(index, 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Describe your responsibilities and achievements..."></textarea>
            </div>
            <button onClick={() => removeExperience(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove Experience</button>
          </div>
        ))}
        {resumeData.experience.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No work experience added yet</p>
            <button onClick={addExperience} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Your First Experience</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;
