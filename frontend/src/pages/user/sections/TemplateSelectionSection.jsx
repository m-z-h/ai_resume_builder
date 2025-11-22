import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates } from '../../../store/templateSlice';

const TemplateSelectionSection = ({ resumeData, setResumeData }) => {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector(state => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleTemplateSelect = (templateId) => {
    setResumeData(prev => ({
      ...prev,
      templateId: templateId,
      designSettings: {
        ...prev.designSettings,
        template: templateId
      }
    }));
  };

  const handleBlankResume = () => {
    setResumeData(prev => ({
      ...prev,
      templateId: null,
      designSettings: {
        template: 'blank',
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        colorTheme: 'blue',
        layout: 'single-column'
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Resume Format</h2>
      <p className="text-gray-600 mb-8">Select a template to get started, or begin with a blank resume</p>

      {/* Blank Resume Option */}
      <div className="mb-8">
        <button
          onClick={handleBlankResume}
          className={`w-full p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
            resumeData.templateId === null && resumeData.designSettings?.template === 'blank'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-20 bg-white border-2 border-gray-300 rounded mr-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900">Start with Blank Resume</h3>
                <p className="text-gray-600">Build your resume from scratch with complete freedom</p>
              </div>
            </div>
            {resumeData.templateId === null && resumeData.designSettings?.template === 'blank' && (
              <div className="text-indigo-600">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Template Options */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Or Choose a Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates && templates.length > 0 ? (
            templates.map((template) => (
              <button
                key={template._id}
                onClick={() => handleTemplateSelect(template._id)}
                className={`p-4 border-2 rounded-xl transition-all hover:shadow-lg text-left ${
                  resumeData.templateId === template._id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                <div className="aspect-[8.5/11] bg-white border border-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden">
                  {template.previewImage ? (
                    <img src={template.previewImage} alt={template.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">{template.name}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description || 'Professional template'}</p>
                    {!template.isFree && (
                      <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Premium</span>
                    )}
                  </div>
                  {resumeData.templateId === template._id && (
                    <div className="text-indigo-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>No templates available. You can start with a blank resume.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionSection;
