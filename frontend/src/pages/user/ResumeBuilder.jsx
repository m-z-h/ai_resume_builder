import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchResumeById, 
  createResume, 
  updateResume, 
  setCurrentResume,
  downloadResumePdf,
  downloadResumeOdf,
  downloadResumeDocx
} from '../../store/resumeSlice';
import { fetchTemplates } from '../../store/templateSlice';
import { useMultipleFeatureCheck } from '../../hooks/useFeatureCheck';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Draggable section component
const DraggableSection = ({ section, index, moveSection, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'section',
    hover: (item) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className={`bg-white rounded-lg shadow p-6 mb-6 ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  );
};

// Resume Builder Component
const ResumeBuilder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resume, isLoading } = useSelector(state => state.resumes);
  const { templates } = useSelector(state => state.templates);
  
  // Check which features are enabled
  const featureStatus = useMultipleFeatureCheck([
    'aiResumeGenerator', 
    'aiSectionImprover', 
    'atsScoreChecker', 
    'pdfDownload', 
    'odfDownload', 
    'docxDownload'
  ]);
  
  const [resumeData, setResumeData] = useState({
    title: '',
    templateId: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    customSections: []
  });
  
  const [sections, setSections] = useState([
    { id: 'personal', title: 'Personal Information', type: 'personalInfo' },
    { id: 'summary', title: 'Professional Summary', type: 'summary' },
    { id: 'experience', title: 'Work Experience', type: 'experience' },
    { id: 'education', title: 'Education', type: 'education' },
    { id: 'skills', title: 'Skills', type: 'skills' },
    { id: 'certifications', title: 'Certifications', type: 'certifications' },
    { id: 'projects', title: 'Projects', type: 'projects' },
    { id: 'languages', title: 'Languages', type: 'languages' }
  ]);
  
  // Load resume data if editing
  useEffect(() => {
    if (id) {
      dispatch(fetchResumeById(id));
    }
    dispatch(fetchTemplates());
  }, [id, dispatch]);
  
  // Update form when resume data is loaded
  useEffect(() => {
    if (resume && id) {
      setResumeData(resume);
    }
  }, [resume, id]);
  
  // Handle input changes
  const handleInputChange = (e, section = null, index = null, field = null) => {
    const { name, value } = e.target;
    
    if (section) {
      // Handle nested array fields
      setResumeData(prev => {
        const updated = { ...prev };
        if (index !== null && field) {
          // Update specific item in array
          updated[section] = [...updated[section]];
          updated[section][index] = { ...updated[section][index], [field]: value };
        } else if (index !== null) {
          // Update entire item in array
          updated[section] = [...updated[section]];
          updated[section][index] = value;
        } else {
          // Update entire section
          updated[section] = value;
        }
        return updated;
      });
    } else {
      // Handle top-level fields
      setResumeData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Move section in drag and drop
  const moveSection = (fromIndex, toIndex) => {
    const updatedSections = [...sections];
    const [movedItem] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedItem);
    setSections(updatedSections);
  };
  
  // Add new item to array section
  const addArrayItem = (section) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [
        ...prev[section],
        section === 'experience' ? {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          description: '',
          achievements: ['']
        } : section === 'education' ? {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          description: ''
        } : section === 'skills' ? {
          name: '',
          level: 'Intermediate'
        } : section === 'certifications' ? {
          name: '',
          issuer: '',
          date: '',
          expirationDate: '',
          credentialId: '',
          url: ''
        } : section === 'projects' ? {
          name: '',
          description: '',
          technologies: [''],
          url: '',
          startDate: '',
          endDate: ''
        } : section === 'languages' ? {
          name: '',
          proficiency: 'Fluent'
        } : section === 'customSections' ? {
          title: '',
          content: ''
        } : {}
      ]
    }));
  };
  
  // Remove item from array section
  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };
  
  // Save resume
  const saveResume = async () => {
    try {
      if (id) {
        // Update existing resume
        await dispatch(updateResume({ id, resumeData })).unwrap();
      } else {
        // Create new resume
        const result = await dispatch(createResume(resumeData)).unwrap();
        // Navigate to edit page
        navigate(`/resume/builder/${result._id}`);
      }
      // Show success message
      alert('Resume saved successfully!');
    } catch (error) {
      // Show error message
      alert('Error saving resume: ' + error);
    }
  };
  
  // Download resume as PDF
  const downloadPdf = async () => {
    if (!featureStatus.pdfDownload) {
      alert('PDF download is currently disabled.');
      return;
    }
    
    try {
      await dispatch(downloadResumePdf(id)).unwrap();
      // In a real implementation, this would trigger a file download
      alert('PDF download started!');
    } catch (error) {
      alert('Error downloading PDF: ' + error);
    }
  };
  
  // Download resume as ODF
  const downloadOdf = async () => {
    if (!featureStatus.odfDownload) {
      alert('ODF download is currently disabled.');
      return;
    }
    
    try {
      await dispatch(downloadResumeOdf(id)).unwrap();
      // In a real implementation, this would trigger a file download
      alert('ODF download started!');
    } catch (error) {
      alert('Error downloading ODF: ' + error);
    }
  };
  
  // Download resume as DOCX
  const downloadDocx = async () => {
    if (!featureStatus.docxDownload) {
      alert('DOCX download is currently disabled.');
      return;
    }
    
    try {
      await dispatch(downloadResumeDocx(id)).unwrap();
      // In a real implementation, this would trigger a file download
      alert('DOCX download started!');
    } catch (error) {
      alert('Error downloading DOCX: ' + error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Edit Resume' : 'Create New Resume'}
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={saveResume}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Resume
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Preview
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar - Sections */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Sections</h2>
                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <DraggableSection 
                      key={section.id} 
                      section={section} 
                      index={index} 
                      moveSection={moveSection}
                    >
                      {section.type === 'personalInfo' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={resumeData.personalInfo.firstName}
                              onChange={(e) => handleInputChange(e, 'personalInfo')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={resumeData.personalInfo.lastName}
                              onChange={(e) => handleInputChange(e, 'personalInfo')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={resumeData.personalInfo.email}
                              onChange={(e) => handleInputChange(e, 'personalInfo')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                              type="text"
                              name="phone"
                              value={resumeData.personalInfo.phone}
                              onChange={(e) => handleInputChange(e, 'personalInfo')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                              type="text"
                              name="address"
                              value={resumeData.personalInfo.address}
                              onChange={(e) => handleInputChange(e, 'personalInfo')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                            <input
                              type="text"
                              name="linkedin"
                              value={resumeData.personalInfo.linkedin}
                              onChange={(e) => handleInputChange(e, 'personalInfo')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Website</label>
                            <input
                              type="text"
                              name="website"
                              value={resumeData.personalInfo.website}
                              onChange={(e) => handleInputChange(e, 'personalInfo')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      )}
                      
                      {section.type === 'summary' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
                          <textarea
                            rows={4}
                            name="summary"
                            value={resumeData.personalInfo.summary}
                            onChange={(e) => handleInputChange(e, 'personalInfo')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      )}
                      
                      {section.type === 'experience' && (
                        <div className="space-y-4">
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">Experience #{idx + 1}</h4>
                                <button 
                                  onClick={() => removeArrayItem('experience', idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Company</label>
                                  <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => handleInputChange(e, 'experience', idx, 'company')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Position</label>
                                  <input
                                    type="text"
                                    value={exp.position}
                                    onChange={(e) => handleInputChange(e, 'experience', idx, 'position')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                  <input
                                    type="date"
                                    value={exp.startDate}
                                    onChange={(e) => handleInputChange(e, 'experience', idx, 'startDate')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                                  <input
                                    type="date"
                                    value={exp.endDate}
                                    onChange={(e) => handleInputChange(e, 'experience', idx, 'endDate')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                  rows={3}
                                  value={exp.description}
                                  onChange={(e) => handleInputChange(e, 'experience', idx, 'description')}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Achievements</label>
                                <div className="space-y-2">
                                  {exp.achievements.map((ach, achIdx) => (
                                    <div key={achIdx} className="flex">
                                      <input
                                        type="text"
                                        value={ach}
                                        onChange={(e) => {
                                          const newAchievements = [...exp.achievements];
                                          newAchievements[achIdx] = e.target.value;
                                          handleInputChange({ target: { value: newAchievements } }, 'experience', idx, 'achievements');
                                        }}
                                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                      <button
                                        onClick={() => {
                                          const newAchievements = [...exp.achievements];
                                          newAchievements.splice(achIdx, 1);
                                          handleInputChange({ target: { value: newAchievements } }, 'experience', idx, 'achievements');
                                        }}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                      >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const newAchievements = [...exp.achievements, ''];
                                      handleInputChange({ target: { value: newAchievements } }, 'experience', idx, 'achievements');
                                    }}
                                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                  >
                                    + Add Achievement
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem('experience')}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            + Add Experience
                          </button>
                        </div>
                      )}
                      
                      {(section.type === 'education' || section.type === 'skills' || section.type === 'certifications' || 
                        section.type === 'projects' || section.type === 'languages') && (
                        <div>
                          <p className="text-sm text-gray-500">Content for {section.title} section would be here.</p>
                          <button
                            onClick={() => addArrayItem(section.type)}
                            className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            + Add Item
                          </button>
                        </div>
                      )}
                    </DraggableSection>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    + Add Custom Section
                  </button>
                </div>
              </div>
              
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Template</h2>
                <div className="grid grid-cols-2 gap-4">
                  {templates.slice(0, 4).map(template => (
                    <div 
                      key={template._id} 
                      className={`border-2 rounded-lg p-2 cursor-pointer ${resumeData.templateId === template._id ? 'border-indigo-500' : 'border-gray-200'}`}
                      onClick={() => setResumeData(prev => ({ ...prev, templateId: template._id }))}
                    >
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-24" />
                      <p className="mt-2 text-sm font-medium text-gray-900">{template.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content - Preview */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
                <div className="border border-gray-300 rounded-lg p-8 min-h-[600px]">
                  {/* Resume preview would be rendered here */}
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Resume Preview</h3>
                    <p className="mt-1 text-sm text-gray-500">Your resume will be previewed here as you build it.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Improve Section
                </button>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Check ATS Score
                </button>
                <div className="relative inline-block text-left">
                  <button 
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full"
                    onClick={(e) => {
                      // Prevent default to avoid form submission
                      e.preventDefault();
                      // Show dropdown menu
                      const menu = e.target.nextElementSibling;
                      menu.classList.toggle('hidden');
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Download
                  </button>
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      {featureStatus.pdfDownload && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            downloadPdf();
                            // Hide dropdown
                            e.target.parentElement.parentElement.classList.add('hidden');
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          Download as PDF
                        </button>
                      )}
                      {featureStatus.odfDownload && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            downloadOdf();
                            // Hide dropdown
                            e.target.parentElement.parentElement.classList.add('hidden');
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          Download as ODF
                        </button>
                      )}
                      {featureStatus.docxDownload && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            downloadDocx();
                            // Hide dropdown
                            e.target.parentElement.parentElement.classList.add('hidden');
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          Download as DOCX
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ResumeBuilder;