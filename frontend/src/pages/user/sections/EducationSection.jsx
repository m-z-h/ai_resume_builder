import React from 'react';

const EducationSection = ({ resumeData, setResumeData }) => {
  const handleChange = (index, field, value) => {
    const newEducation = [...resumeData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setResumeData(prev => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const removeEducation = (index) => {
    const newEducation = [...resumeData.education];
    newEducation.splice(index, 1);
    setResumeData(prev => ({ ...prev, education: newEducation }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        <button onClick={addEducation} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Education</button>
      </div>
      <div className="space-y-6">
        {resumeData.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                <input type="text" value={edu.degree} onChange={(e) => handleChange(index, 'degree', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Bachelor of Science" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                <input type="text" value={edu.fieldOfStudy} onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Computer Science" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                <input type="text" value={edu.institution} onChange={(e) => handleChange(index, 'institution', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="University Name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input type="month" value={edu.startDate} onChange={(e) => handleChange(index, 'startDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input type="month" value={edu.endDate} onChange={(e) => handleChange(index, 'endDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
            <button onClick={() => removeEducation(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove Education</button>
          </div>
        ))}
        {resumeData.education.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No education added yet</p>
            <button onClick={addEducation} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Your First Education</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationSection;
