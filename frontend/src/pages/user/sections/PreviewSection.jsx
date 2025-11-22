import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { downloadResumePdf, downloadResumeDocx, updateResume } from '../../../store/resumeSlice';

const PreviewSection = ({ resumeData, setResumeData }) => {
  const dispatch = useDispatch();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [finalResumeSaved, setFinalResumeSaved] = useState(false);

  const handleDesignChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      designSettings: { ...prev.designSettings, [field]: value }
    }));
  };

  const fontFamilies = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'Georgia', value: 'Georgia, serif' }
  ];

  const fontSizes = [
    { name: 'Small', value: '14px' },
    { name: 'Medium', value: '16px' },
    { name: 'Large', value: '18px' }
  ];

  const colorThemes = [
    { name: 'Blue', value: 'blue', gradient: 'from-blue-600 to-indigo-600' },
    { name: 'Green', value: 'green', gradient: 'from-green-600 to-teal-600' },
    { name: 'Purple', value: 'purple', gradient: 'from-purple-600 to-pink-600' },
    { name: 'Red', value: 'red', gradient: 'from-red-600 to-orange-600' },
    { name: 'Gray', value: 'gray', gradient: 'from-gray-600 to-slate-600' }
  ];

  const layouts = [
    { name: 'Single Column', value: 'single-column' },
    { name: 'Two Column', value: 'two-column' }
  ];

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
    const themeObj = colorThemes.find(t => t.value === theme);
    return themeObj ? themeObj.gradient : 'from-blue-600 to-indigo-600';
  };

  const handlePreviewResume = () => {
    // Show the resume preview
    setShowDownloadOptions(true);
  };

  const handleSaveFinalResume = async () => {
    try {
      // Save the final resume with design settings to the backend
      await dispatch(updateResume({ id: resumeData._id, resumeData })).unwrap();
      setFinalResumeSaved(true);
      alert('Final resume saved successfully! You can now download your resume.');
    } catch (error) {
      console.error('Error saving final resume:', error);
      alert('Failed to save final resume. Please try again.');
    }
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
            <select 
              value={fontFamilies.find(f => f.value === resumeData.designSettings.fontFamily)?.name || 'Inter'} 
              onChange={(e) => {
                const selectedFont = fontFamilies.find(f => f.name === e.target.value);
                if (selectedFont) handleDesignChange('fontFamily', selectedFont.value);
              }} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {fontFamilies.map(font => (
                <option key={font.name} value={font.name}>{font.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select 
              value={fontSizes.find(s => s.value === resumeData.designSettings.fontSize)?.name || 'Medium'} 
              onChange={(e) => {
                const selectedSize = fontSizes.find(s => s.name === e.target.value);
                if (selectedSize) handleDesignChange('fontSize', selectedSize.value);
              }} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {fontSizes.map(size => (
                <option key={size.name} value={size.name}>{size.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
            <div className="flex flex-wrap gap-2">
              {colorThemes.map(theme => (
                <button
                  key={theme.value}
                  onClick={() => handleDesignChange('colorTheme', theme.value)}
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${theme.gradient} ${resumeData.designSettings.colorTheme === theme.value ? 'ring-4 ring-offset-2 ring-indigo-500' : ''}`}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
            <select 
              value={layouts.find(l => l.value === resumeData.designSettings.layout)?.name || 'Single Column'} 
              onChange={(e) => {
                const selectedLayout = layouts.find(l => l.name === e.target.value);
                if (selectedLayout) handleDesignChange('layout', selectedLayout.value);
              }} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {layouts.map(layout => (
                <option key={layout.name} value={layout.name}>{layout.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={handlePreviewResume}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700"
          >
            Preview Resume
          </button>
        </div>
      </div>

      {/* Resume Preview */}
      {showDownloadOptions && (
        <div className="mb-8 p-8 bg-white border-2 border-gray-300 rounded-lg" style={{ fontFamily: resumeData.designSettings.fontFamily, fontSize: resumeData.designSettings.fontSize }}>
          <div className={`text-center mb-6 bg-gradient-to-r ${getColorClass(resumeData.designSettings.colorTheme)} text-white p-6 rounded-lg`}>
            <h1 className="text-3xl font-bold">{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</h1>
            <div className="mt-2 text-sm flex flex-wrap justify-center gap-4">
              {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.address && <span>{resumeData.personalInfo.address}</span>}
              {resumeData.personalInfo.linkedin && (
                <a href={resumeData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="underline">
                  LinkedIn
                </a>
              )}
              {resumeData.personalInfo.website && (
                <a href={resumeData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="underline">
                  Website
                </a>
              )}
            </div>
          </div>

          {resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">Summary</h2>
              <p className="text-gray-700">{resumeData.summary}</p>
            </div>
          )}

          {resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">Experience</h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-700">{exp.company} | {exp.location}</p>
                  <p className="text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</p>
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
                  <p className="text-gray-700">{edu.school} | {edu.location}</p>
                  <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
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
                  {project.technologies && <p className="text-gray-700">{project.technologies}</p>}
                  <p className="text-gray-600">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
                      View Project
                    </a>
                  )}
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
                  <p className="text-gray-700">{cert.issuer}</p>
                  {cert.date && <p className="text-gray-600">{cert.date}</p>}
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
                      Verify
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {resumeData.customSections && resumeData.customSections.length > 0 && (
            <div className="mb-6">
              {resumeData.customSections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-1">{section.title}</h2>
                  <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Download Options */}
      {showDownloadOptions && (
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
          <div className="mt-4">
            <button 
              onClick={handleSaveFinalResume}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800"
            >
              Save Final Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;