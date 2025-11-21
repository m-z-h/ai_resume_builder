import React from 'react';

const SkillsSection = ({ resumeData, setResumeData }) => {
  const handleChange = (value) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setResumeData(prev => ({ ...prev, skills: skillsArray }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
        <textarea
          rows={6}
          value={resumeData.skills.join(', ')}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="JavaScript, React, Node.js, Python, SQL, etc."
        ></textarea>
        <p className="mt-2 text-sm text-gray-500">Enter skills separated by commas</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
