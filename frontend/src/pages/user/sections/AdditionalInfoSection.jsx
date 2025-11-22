import React from 'react';

const AdditionalInfoSection = ({ resumeData, setResumeData }) => {
  const addCustomSection = () => {
    setResumeData(prev => ({
      ...prev,
      customSections: [...prev.customSections, { title: '', content: '' }]
    }));
  };

  const updateCustomSection = (index, field, value) => {
    setResumeData(prev => {
      const newSections = [...prev.customSections];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, customSections: newSections };
    });
  };

  const removeCustomSection = (index) => {
    setResumeData(prev => {
      const newSections = [...prev.customSections];
      newSections.splice(index, 1);
      return { ...prev, customSections: newSections };
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
        <button
          onClick={addCustomSection}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Section
        </button>
      </div>
      
      <div className="space-y-6">
        {resumeData.customSections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor={`section-title-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  id={`section-title-${index}`}
                  value={section.title}
                  onChange={(e) => updateCustomSection(index, 'title', e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., Publications, Volunteer Work, Awards"
                />
              </div>
              
              <div>
                <label htmlFor={`section-content-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id={`section-content-${index}`}
                  rows={4}
                  value={section.content}
                  onChange={(e) => updateCustomSection(index, 'content', e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                  placeholder="Enter details for this section..."
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => removeCustomSection(index)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        ))}
        
        {resumeData.customSections.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No additional sections added</h3>
            <p className="mt-2 text-gray-500">Add custom sections to include additional information.</p>
            <div className="mt-6">
              <button
                onClick={addCustomSection}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Section
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfoSection;