import React from 'react';
import { useDispatch } from 'react-redux';
import { downloadResumePdf, downloadResumeDocx } from '../../../store/resumeSlice';

const PreviewSection = ({ resumeData, setResumeData }) => {
  const dispatch = useDispatch();

  const handleDesignChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      designSettings: { ...prev.designSettings, [field]: value }
    }));
  };

  const fontFamilies = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];
  const fontSizes = ['small', 'medium', 'large'];
  const colorThemes = ['blue', 'green', 'purple', 'red', 'gray'];
  const layouts = ['single-column', 'two-column'];

  const downloadResume = async (format) => {
    try {
      if (format === 'pdf') {
        await dispatch(downloadResumePdf(resumeData._id)).unwrap();
      } else if (format === 'docx') {
        await dispatch(downloadResumeDocx(resumeData._id)).unwrap();
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please save your resume first.');
    }
  };

  const getColorClass = (theme) => {
    const colors = {
      blue: 'from-blue-600 to-indigo-600',
      green: 'from-green-600 to-teal-600',
      purple: 'from-purple-600 to-pink-600',
      red: 'from-red-600 to-orange-600',
      gray: 'from-gray-600 to-slate-600'
    };
    return colors[theme] || colors.blue;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Preview & Design Customization</h2>
      
      {/* Design Settings */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Design</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
            <select value={resumeData.designSettings.fontFamily} onChange={(e) => handleDesignChange('fontFamily', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select value={resumeData.designSettings.fontSize} onChange={(e) => handleDesignChange('fontSize', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              {fontSizes.map(size => (
                <option key={size} value={size}>{size.charAt(0).toUpperCase() + size.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
            <div className="flex gap-2">
              {colorThemes.map(theme => (
                <button
                  key={theme}
                  onClick={() => handleDesignChange('colorTheme', theme)}
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getColorClass(theme)} ${resumeData.designSettings.colorTheme === theme ? 'ring-4 ring-offset-2 ring-indigo-500' : ''}`}
                  title={theme}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
            <select value={resumeData.designSettings.layout} onChange={(e) => handleDesignChange('layout', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              {layouts.map(layout => (
                <option key={layout} value={layout}>{layout.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="mb-8 p-8 bg-white border-2 border-gray-300 rounded-lg" style={{ fontFamily: resumeData.designSettings.fontFamily }}>
        <div className={`text-center mb-6 bg-gradient-to-r ${getColorClass(resumeData.designSettings.colorTheme)} text-white p-6 rounded-lg`}>
          <h1 className="text-3xl font-bold">{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</h1>
          <div className="mt-2 text-sm">
            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span className="ml-4">{resumeData.personalInfo.phone}</span>}
          </div>
        </div>

        {resumeData.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">Summary</h2>
            <p className="text-gray-700">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <p className="text-gray-700">{exp.company} | {exp.startDate} - {exp.endDate || 'Present'}</p>
                <p className="text-gray-600 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {resumeData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {resumeData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className={`px-3 py-1 bg-gradient-to-r ${getColorClass(resumeData.designSettings.colorTheme)} text-white rounded-full text-sm`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {resumeData.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">Projects</h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        )}

        {resumeData.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <p className="text-gray-700">{cert.issuer} | {cert.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Resume</h3>
        <div className="flex gap-4">
          <button onClick={() => downloadResume('pdf')} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800">
            Download PDF
          </button>
          <button onClick={() => downloadResume('docx')} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800">
            Download Word
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
