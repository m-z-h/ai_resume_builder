import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    <div ref={(node) => drag(drop(node))} className={`bg-white rounded-2xl shadow-xl p-6 mb-6 ${isDragging ? 'opacity-50' : 'opacity-100'} transition-all duration-300 hover:shadow-2xl`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors duration-150">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  );
};

// Resume Preview Component
const ResumePreview = ({ resumeData }) => {
  // Generate the title from name if not provided
  const displayTitle = resumeData.title && resumeData.title.trim() !== '' 
    ? resumeData.title 
    : `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim();
  
  return (
    <div className="border-2 border-gray-300 rounded-2xl p-8 min-h-[600px] bg-white shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {displayTitle}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-base text-gray-700">
            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.address && <span>{resumeData.personalInfo.address}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeBuilder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentResume, loading, error } = useSelector(state => state.resumes);
  const { templates } = useSelector(state => state.templates);
  
  const [resumeData, setResumeData] = useState({
    title: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });
  
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  
  // Check feature limits
  const { hasFeatureAccess, featureLoading } = useMultipleFeatureCheck([
    'aiResumeGenerator',
    'pdfDownload',
    'docxDownload',
    'odfDownload'
  ]);
  
  // Fetch resume if editing existing one
  useEffect(() => {
    if (id) {
      dispatch(fetchResumeById(id));
    } else {
      dispatch(setCurrentResume(null));
    }
    dispatch(fetchTemplates());
  }, [id, dispatch]);
  
  // Set resume data when fetched
  useEffect(() => {
    if (currentResume) {
      setResumeData(currentResume);
    }
  }, [currentResume]);
  
  // Handle input changes
  const handleInputChange = (section, field, value) => {
    if (section === 'personalInfo') {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };
  
  // Handle array changes (experience, education, etc.)
  const handleArrayChange = (section, index, field, value) => {
    setResumeData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: newArray
      };
    });
  };
  
  // Add new item to array
  const addArrayItem = (section, newItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };
  
  // Remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData(prev => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: newArray
      };
    });
  };
  
  // Move section in drag and drop
  const moveSection = useCallback((fromIndex, toIndex) => {
    setResumeData(prev => {
      const newArray = [...prev.experience];
      const [movedItem] = newArray.splice(fromIndex, 1);
      newArray.splice(toIndex, 0, movedItem);
      return {
        ...prev,
        experience: newArray
      };
    });
  }, []);
  
  // Save resume
  const saveResume = () => {
    // Generate a title if one doesn't exist
    let resumeToSave = resumeData;
    if (!id && (!resumeData.title || resumeData.title.trim() === '')) {
      const generatedTitle = `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim() || 'Untitled Resume';
      resumeToSave = { ...resumeData, title: generatedTitle };
    }
    
    if (id) {
      dispatch(updateResume({ id, resumeData: resumeToSave }));
    } else {
      dispatch(createResume(resumeToSave));
    }
  };
  
  // Download resume
  const downloadResume = (format) => {
    if (!hasFeatureAccess(format === 'pdf' ? 'pdfDownload' : format === 'docx' ? 'docxDownload' : 'odfDownload')) {
      return;
    }
    
    if (format === 'pdf') {
      dispatch(downloadResumePdf(id || currentResume._id));
    } else if (format === 'docx') {
      dispatch(downloadResumeDocx(id || currentResume._id));
    } else if (format === 'odf') {
      dispatch(downloadResumeOdf(id || currentResume._id));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl relative" role="alert">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="block sm:inline text-lg">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? 'Edit Resume' : 'Create Resume'}
              </h1>
              <p className="mt-1 text-gray-600">
                Build your perfect resume with our AI-powered tools
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-4 py-3 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                onClick={saveResume}
                className="inline-flex items-center px-4 py-3 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Resume
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Sections */}
            <div className={`lg:col-span-8 ${showPreview ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { id: 'personal', label: 'Personal Info' },
                    { id: 'summary', label: 'Summary' },
                    { id: 'experience', label: 'Experience' },
                    { id: 'education', label: 'Education' },
                    { id: 'skills', label: 'Skills' },
                    { id: 'projects', label: 'Projects' },
                    { id: 'certifications', label: 'Certifications' }
                  ].map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
                
                {/* Personal Info Section */}
                {activeSection === 'personal' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-lg font-bold text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={resumeData.personalInfo.firstName}
                          onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                          placeholder="John"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-lg font-bold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={resumeData.personalInfo.lastName}
                          onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                          placeholder="Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-lg font-bold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-lg font-bold text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-lg font-bold text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          value={resumeData.personalInfo.address}
                          onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                          placeholder="123 Main St, City, State 12345"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="linkedin" className="block text-lg font-bold text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          id="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="website" className="block text-lg font-bold text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          id="website"
                          value={resumeData.personalInfo.website}
                          onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Summary Section */}
                {activeSection === 'summary' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h2>
                    <div>
                      <label htmlFor="summary" className="block text-lg font-bold text-gray-700 mb-2">
                        Summary
                      </label>
                      <textarea
                        id="summary"
                        rows={6}
                        value={resumeData.summary}
                        onChange={(e) => handleInputChange('summary', 'summary', e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                        placeholder="A brief summary of your professional background, skills, and career goals..."
                      ></textarea>
                    </div>
                  </div>
                )}
                
                {/* Experience Section */}
                {activeSection === 'experience' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                      <button
                        onClick={() => addArrayItem('experience', {
                          title: '',
                          company: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          description: ''
                        })}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Experience
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {resumeData.experience.map((exp, index) => (
                        <DraggableSection 
                          key={index} 
                          section={{ title: `Experience ${index + 1}` }} 
                          index={index} 
                          moveSection={moveSection}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor={`exp-title-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Job Title
                              </label>
                              <input
                                type="text"
                                id={`exp-title-${index}`}
                                value={exp.title}
                                onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="Software Engineer"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`exp-company-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Company
                              </label>
                              <input
                                type="text"
                                id={`exp-company-${index}`}
                                value={exp.company}
                                onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="Company Name"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`exp-location-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                id={`exp-location-${index}`}
                                value={exp.location}
                                onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="City, State"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor={`exp-start-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="month"
                                  id={`exp-start-${index}`}
                                  value={exp.startDate}
                                  onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor={`exp-end-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                  End Date
                                </label>
                                <input
                                  type="month"
                                  id={`exp-end-${index}`}
                                  value={exp.endDate}
                                  onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                />
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <label htmlFor={`exp-desc-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                id={`exp-desc-${index}`}
                                rows={4}
                                value={exp.description}
                                onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="Describe your responsibilities and achievements..."
                              ></textarea>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => removeArrayItem('experience', index)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                            >
                              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </DraggableSection>
                      ))}
                      
                      {resumeData.experience.length === 0 && (
                        <div className="text-center py-12">
                          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">No work experience added</h3>
                          <p className="mt-2 text-gray-500">Add your work experience to showcase your career history.</p>
                          <div className="mt-6">
                            <button
                              onClick={() => addArrayItem('experience', {
                                title: '',
                                company: '',
                                location: '',
                                startDate: '',
                                endDate: '',
                                description: ''
                              })}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                            >
                              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Experience
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Education Section */}
                {activeSection === 'education' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                      <button
                        onClick={() => addArrayItem('education', {
                          degree: '',
                          school: '',
                          location: '',
                          startDate: '',
                          endDate: ''
                        })}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Education
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor={`edu-degree-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Degree
                              </label>
                              <input
                                type="text"
                                id={`edu-degree-${index}`}
                                value={edu.degree}
                                onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="Bachelor of Science in Computer Science"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`edu-school-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                School
                              </label>
                              <input
                                type="text"
                                id={`edu-school-${index}`}
                                value={edu.school}
                                onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="University Name"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`edu-location-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Location
                              </label>
                              <input
                                type="text"
                                id={`edu-location-${index}`}
                                value={edu.location}
                                onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="City, State"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor={`edu-start-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="month"
                                  id={`edu-start-${index}`}
                                  value={edu.startDate}
                                  onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor={`edu-end-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                  End Date
                                </label>
                                <input
                                  type="month"
                                  id={`edu-end-${index}`}
                                  value={edu.endDate}
                                  onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => removeArrayItem('education', index)}
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
                      
                      {resumeData.education.length === 0 && (
                        <div className="text-center py-12">
                          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">No education added</h3>
                          <p className="mt-2 text-gray-500">Add your educational background to showcase your qualifications.</p>
                          <div className="mt-6">
                            <button
                              onClick={() => addArrayItem('education', {
                                degree: '',
                                school: '',
                                location: '',
                                startDate: '',
                                endDate: ''
                              })}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                            >
                              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Education
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Skills Section */}
                {activeSection === 'skills' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
                    <div>
                      <label htmlFor="skills" className="block text-lg font-bold text-gray-700 mb-2">
                        Skills (comma separated)
                      </label>
                      <textarea
                        id="skills"
                        rows={6}
                        value={resumeData.skills.join(', ')}
                        onChange={(e) => handleInputChange('skills', 'skills', e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill))}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                        placeholder="JavaScript, React, Node.js, Python, SQL, etc."
                      ></textarea>
                      <p className="mt-2 text-sm text-gray-500">Enter skills separated by commas</p>
                    </div>
                  </div>
                )}
                
                {/* Projects Section */}
                {activeSection === 'projects' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                      <button
                        onClick={() => addArrayItem('projects', {
                          name: '',
                          description: '',
                          technologies: '',
                          link: ''
                        })}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Project
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {resumeData.projects.map((project, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor={`project-name-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Project Name
                              </label>
                              <input
                                type="text"
                                id={`project-name-${index}`}
                                value={project.name}
                                onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="Project Name"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`project-link-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Project Link
                              </label>
                              <input
                                type="url"
                                id={`project-link-${index}`}
                                value={project.link}
                                onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="https://project-link.com"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label htmlFor={`project-tech-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Technologies Used
                              </label>
                              <input
                                type="text"
                                id={`project-tech-${index}`}
                                value={project.technologies}
                                onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="React, Node.js, MongoDB, etc."
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label htmlFor={`project-desc-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                id={`project-desc-${index}`}
                                rows={4}
                                value={project.description}
                                onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="Describe the project, your role, and key achievements..."
                              ></textarea>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => removeArrayItem('projects', index)}
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
                      
                      {resumeData.projects.length === 0 && (
                        <div className="text-center py-12">
                          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">No projects added</h3>
                          <p className="mt-2 text-gray-500">Add your projects to showcase your work and skills.</p>
                          <div className="mt-6">
                            <button
                              onClick={() => addArrayItem('projects', {
                                name: '',
                                description: '',
                                technologies: '',
                                link: ''
                              })}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                            >
                              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Project
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Certifications Section */}
                {activeSection === 'certifications' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                      <button
                        onClick={() => addArrayItem('certifications', {
                          name: '',
                          issuer: '',
                          date: '',
                          link: ''
                        })}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Certification
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {resumeData.certifications.map((cert, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor={`cert-name-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Certification Name
                              </label>
                              <input
                                type="text"
                                id={`cert-name-${index}`}
                                value={cert.name}
                                onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="AWS Certified Solutions Architect"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`cert-issuer-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Issuing Organization
                              </label>
                              <input
                                type="text"
                                id={`cert-issuer-${index}`}
                                value={cert.issuer}
                                onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="Amazon Web Services"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`cert-date-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Date Earned
                              </label>
                              <input
                                type="month"
                                id={`cert-date-${index}`}
                                value={cert.date}
                                onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`cert-link-${index}`} className="block text-lg font-bold text-gray-700 mb-2">
                                Verification Link
                              </label>
                              <input
                                type="url"
                                id={`cert-link-${index}`}
                                value={cert.link}
                                onChange={(e) => handleArrayChange('certifications', index, 'link', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                                placeholder="https://cert-link.com"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => removeArrayItem('certifications', index)}
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
                      
                      {resumeData.certifications.length === 0 && (
                        <div className="text-center py-12">
                          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">No certifications added</h3>
                          <p className="mt-2 text-gray-500">Add your certifications to showcase your credentials.</p>
                          <div className="mt-6">
                            <button
                              onClick={() => addArrayItem('certifications', {
                                name: '',
                                issuer: '',
                                date: '',
                                link: ''
                              })}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                            >
                              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Certification
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Preview Section */}
            {showPreview && (
              <div className="lg:col-span-4">
                <div className="sticky top-8">
                  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <ResumePreview resumeData={resumeData} />
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Download Options</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => downloadResume('pdf')}
                          disabled={!hasFeatureAccess('pdfDownload')}
                          className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          PDF
                        </button>
                        
                        <button
                          onClick={() => downloadResume('docx')}
                          disabled={!hasFeatureAccess('docxDownload')}
                          className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          DOCX
                        </button>
                        
                        <button
                          onClick={() => downloadResume('odf')}
                          disabled={!hasFeatureAccess('odfDownload')}
                          className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:opacity-50"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          ODF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ResumeBuilder;