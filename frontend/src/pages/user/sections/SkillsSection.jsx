import React, { useState } from 'react';

const SkillsSection = ({ resumeData, setResumeData }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      // Ensure skills is an array
      const currentSkills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
      const updatedSkills = [...currentSkills, newSkill.trim()];
      setResumeData(prev => ({ ...prev, skills: updatedSkills }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    // Ensure skills is an array
    const currentSkills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
    const updatedSkills = [...currentSkills];
    updatedSkills.splice(index, 1);
    setResumeData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Ensure skills is an array for rendering
  const skillsArray = Array.isArray(resumeData.skills) ? resumeData.skills : [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Skills</label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Type a skill and press Enter or click Add"
          />
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700"
          >
            Add
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">Press Enter or click Add after typing each skill</p>
        
        {skillsArray.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Current Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center">
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;