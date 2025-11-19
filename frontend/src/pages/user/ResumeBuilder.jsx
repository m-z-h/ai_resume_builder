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

// Resume Preview Component
const ResumePreview = ({ resumeData }) => {
  // Generate the title from name if not provided
  const displayTitle = resumeData.title && resumeData.title.trim() !== '' 
    ? resumeData.title 
    : `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim();
  
  return (
    <div className="border border-gray-300 rounded-lg p-8 min-h-[600px]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            {displayTitle}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
            {resumeData.personalInfo.address && <span>{resumeData.personalInfo.address}</span>}
            {resumeData.personalInfo.linkedin && <span>LinkedIn: {resumeData.personalInfo.linkedin}</span>}
            {resumeData.personalInfo.website && <span>Website: {resumeData.personalInfo.website}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Professional Summary</h2>
            <p className="text-gray-700">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {resumeData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Work Experience</h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{exp.position}</h3>
                    <span className="text-gray-600">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString()} - 
                      {exp.isCurrent ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-medium">{exp.company}</p>
                  {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-gray-700">
                      {exp.achievements.filter(ach => ach).map((ach, achIndex) => (
                        <li key={achIndex}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Education</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <span className="text-gray-600">
                      {edu.startDate && new Date(edu.startDate).getFullYear()} - 
                      {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                    </span>
                  </div>
                  <p className="font-medium">{edu.institution}</p>
                  {edu.fieldOfStudy && <p>{edu.fieldOfStudy}</p>}
                  {edu.description && <p className="mt-1 text-gray-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {skill.name} {skill.level && `(${skill.level})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Certifications</h2>
            <div className="space-y-3">
              {resumeData.certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                  {cert.date && <p className="text-sm">Issued: {new Date(cert.date).toLocaleDateString()}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resumeData.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Projects</h2>
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    {project.startDate && (
                      <span className="text-gray-600">
                        {new Date(project.startDate).getFullYear()} - 
                        {project.endDate ? new Date(project.endDate).getFullYear() : 'Present'}
                      </span>
                    )}
                  </div>
                  {project.description && <p className="mt-1 text-gray-700">{project.description}</p>}
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {project.url}
                    </a>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.technologies.filter(tech => tech).map((tech, techIndex) => (
                        <span key={techIndex} className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resumeData.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">Languages</h2>
            <div className="grid grid-cols-2 gap-2">
              {resumeData.languages.map((lang, index) => (
                <div key={index} className="flex justify-between">
                  <span>{lang.name}</span>
                  {lang.proficiency && <span className="text-gray-600">{lang.proficiency}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
  
  // Define the feature names array as a constant to prevent re-renders
  const resumeFeatureNames = useMemo(() => [
    'aiResumeGenerator', 
    'aiSectionImprover', 
    'atsScoreChecker', 
    'pdfDownload', 
    'odfDownload', 
    'docxDownload'
  ], []);
  
  // Check which features are enabled
  const featureStatus = useMultipleFeatureCheck(resumeFeatureNames);
  
  // Debug log to see feature status
  useEffect(() => {
    console.log('ResumeBuilder featureStatus:', featureStatus);
  }, [featureStatus]);
  
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
  
  // Handle input changes for personal info
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };
  
  // Handle input changes for array items
  const handleArrayItemChange = (section, index, field, value) => {
    setResumeData(prev => {
      const updated = { ...prev };
      updated[section] = [...updated[section]];
      updated[section][index] = { ...updated[section][index], [field]: value };
      return updated;
    });
  };
  
  // Handle achievements changes
  const handleAchievementsChange = (expIndex, achIndex, value) => {
    setResumeData(prev => {
      const updated = { ...prev };
      updated.experience = [...updated.experience];
      updated.experience[expIndex] = { ...updated.experience[expIndex] };
      const achievements = [...updated.experience[expIndex].achievements];
      achievements[achIndex] = value;
      updated.experience[expIndex].achievements = achievements;
      return updated;
    });
  };
  
  // Add achievement to experience
  const addAchievement = (expIndex) => {
    setResumeData(prev => {
      const updated = { ...prev };
      updated.experience = [...updated.experience];
      updated.experience[expIndex] = { ...updated.experience[expIndex] };
      updated.experience[expIndex].achievements = [
        ...updated.experience[expIndex].achievements,
        ''
      ];
      return updated;
    });
  };
  
  // Remove achievement from experience
  const removeAchievement = (expIndex, achIndex) => {
    setResumeData(prev => {
      const updated = { ...prev };
      updated.experience = [...updated.experience];
      updated.experience[expIndex] = { ...updated.experience[expIndex] };
      const achievements = [...updated.experience[expIndex].achievements];
      achievements.splice(achIndex, 1);
      updated.experience[expIndex].achievements = achievements;
      return updated;
    });
  };
  
  // Handle technologies changes in projects
  const handleTechnologiesChange = (projIndex, techIndex, value) => {
    setResumeData(prev => {
      const updated = { ...prev };
      updated.projects = [...updated.projects];
      updated.projects[projIndex] = { ...updated.projects[projIndex] };
      const technologies = [...updated.projects[projIndex].technologies];
      technologies[techIndex] = value;
      updated.projects[projIndex].technologies = technologies;
      return updated;
    });
  };
  
  // Add technology to project
  const addTechnology = (projIndex) => {
    setResumeData(prev => {
      const updated = { ...prev };
      updated.projects = [...updated.projects];
      updated.projects[projIndex] = { ...updated.projects[projIndex] };
      updated.projects[projIndex].technologies = [
        ...updated.projects[projIndex].technologies,
        ''
      ];
      return updated;
    });
  };
  
  // Remove technology from project
  const removeTechnology = (projIndex, techIndex) => {
    setResumeData(prev => {
      const updated = { ...prev };
      updated.projects = [...updated.projects];
      updated.projects[projIndex] = { ...updated.projects[projIndex] };
      const technologies = [...updated.projects[projIndex].technologies];
      technologies.splice(techIndex, 1);
      updated.projects[projIndex].technologies = technologies;
      return updated;
    });
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
      // Automatically set the title to be the person's name if not provided
      const resumeTitle = resumeData.title && resumeData.title.trim() !== '' 
        ? resumeData.title 
        : `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}`.trim() || 'Untitled Resume';
      
      // Create a copy of resumeData with the updated title
      const resumeDataWithTitle = {
        ...resumeData,
        title: resumeTitle
      };
      
      if (id) {
        // Update existing resume
        await dispatch(updateResume({ id, resumeData: resumeDataWithTitle })).unwrap();
        alert('Resume updated successfully!');
      } else {
        // Create new resume
        const result = await dispatch(createResume(resumeDataWithTitle)).unwrap();
        // Navigate to edit page
        navigate(`/resume/builder/${result._id}`);
        alert('Resume created successfully!');
      }
    } catch (error) {
      alert('Error saving resume: ' + (error.message || 'Unknown error'));
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
      alert('PDF download started!');
    } catch (error) {
      alert('Error downloading PDF: ' + (error.message || 'Unknown error'));
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
      alert('ODF download started!');
    } catch (error) {
      alert('Error downloading ODF: ' + (error.message || 'Unknown error'));
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
      alert('DOCX download started!');
    } catch (error) {
      alert('Error downloading DOCX: ' + (error.message || 'Unknown error'));
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
        <div className="w-full px-4">
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
                              onChange={handlePersonalInfoChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={resumeData.personalInfo.lastName}
                              onChange={handlePersonalInfoChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={resumeData.personalInfo.email}
                              onChange={handlePersonalInfoChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                              type="text"
                              name="phone"
                              value={resumeData.personalInfo.phone}
                              onChange={handlePersonalInfoChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                              type="text"
                              name="address"
                              value={resumeData.personalInfo.address}
                              onChange={handlePersonalInfoChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                            <input
                              type="text"
                              name="linkedin"
                              value={resumeData.personalInfo.linkedin}
                              onChange={handlePersonalInfoChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Website</label>
                            <input
                              type="text"
                              name="website"
                              value={resumeData.personalInfo.website}
                              onChange={handlePersonalInfoChange}
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
                            onChange={handlePersonalInfoChange}
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
                                    value={exp.company || ''}
                                    onChange={(e) => handleArrayItemChange('experience', idx, 'company', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Position</label>
                                  <input
                                    type="text"
                                    value={exp.position || ''}
                                    onChange={(e) => handleArrayItemChange('experience', idx, 'position', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                  <input
                                    type="date"
                                    value={exp.startDate || ''}
                                    onChange={(e) => handleArrayItemChange('experience', idx, 'startDate', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                                  <input
                                    type="date"
                                    value={exp.endDate || ''}
                                    onChange={(e) => handleArrayItemChange('experience', idx, 'endDate', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={exp.isCurrent || false}
                                      onChange={(e) => handleArrayItemChange('experience', idx, 'isCurrent', e.target.checked)}
                                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Currently working here</span>
                                  </label>
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                  rows={3}
                                  value={exp.description || ''}
                                  onChange={(e) => handleArrayItemChange('experience', idx, 'description', e.target.value)}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Achievements</label>
                                <div className="space-y-2">
                                  {exp.achievements && exp.achievements.map((ach, achIdx) => (
                                    <div key={achIdx} className="flex">
                                      <input
                                        type="text"
                                        value={ach || ''}
                                        onChange={(e) => handleAchievementsChange(idx, achIdx, e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                      <button
                                        onClick={() => removeAchievement(idx, achIdx)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                      >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => addAchievement(idx)}
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
                      
                      {section.type === 'education' && (
                        <div className="space-y-4">
                          {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">Education #{idx + 1}</h4>
                                <button 
                                  onClick={() => removeArrayItem('education', idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                                  <input
                                    type="text"
                                    value={edu.institution || ''}
                                    onChange={(e) => handleArrayItemChange('education', idx, 'institution', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Degree</label>
                                  <input
                                    type="text"
                                    value={edu.degree || ''}
                                    onChange={(e) => handleArrayItemChange('education', idx, 'degree', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                                  <input
                                    type="text"
                                    value={edu.fieldOfStudy || ''}
                                    onChange={(e) => handleArrayItemChange('education', idx, 'fieldOfStudy', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                  <input
                                    type="date"
                                    value={edu.startDate || ''}
                                    onChange={(e) => handleArrayItemChange('education', idx, 'startDate', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                                  <input
                                    type="date"
                                    value={edu.endDate || ''}
                                    onChange={(e) => handleArrayItemChange('education', idx, 'endDate', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={edu.isCurrent || false}
                                      onChange={(e) => handleArrayItemChange('education', idx, 'isCurrent', e.target.checked)}
                                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Currently studying here</span>
                                  </label>
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                  rows={2}
                                  value={edu.description || ''}
                                  onChange={(e) => handleArrayItemChange('education', idx, 'description', e.target.value)}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem('education')}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            + Add Education
                          </button>
                        </div>
                      )}
                      
                      {section.type === 'skills' && (
                        <div className="space-y-4">
                          {resumeData.skills.map((skill, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">Skill #{idx + 1}</h4>
                                <button 
                                  onClick={() => removeArrayItem('skills', idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Skill Name</label>
                                  <input
                                    type="text"
                                    value={skill.name || ''}
                                    onChange={(e) => handleArrayItemChange('skills', idx, 'name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Level</label>
                                  <select
                                    value={skill.level || 'Intermediate'}
                                    onChange={(e) => handleArrayItemChange('skills', idx, 'level', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem('skills')}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            + Add Skill
                          </button>
                        </div>
                      )}
                      
                      {section.type === 'certifications' && (
                        <div className="space-y-4">
                          {resumeData.certifications.map((cert, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">Certification #{idx + 1}</h4>
                                <button 
                                  onClick={() => removeArrayItem('certifications', idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                                  <input
                                    type="text"
                                    value={cert.name || ''}
                                    onChange={(e) => handleArrayItemChange('certifications', idx, 'name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Issuer</label>
                                  <input
                                    type="text"
                                    value={cert.issuer || ''}
                                    onChange={(e) => handleArrayItemChange('certifications', idx, 'issuer', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                                  <input
                                    type="date"
                                    value={cert.date || ''}
                                    onChange={(e) => handleArrayItemChange('certifications', idx, 'date', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
                                  <input
                                    type="date"
                                    value={cert.expirationDate || ''}
                                    onChange={(e) => handleArrayItemChange('certifications', idx, 'expirationDate', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">Credential ID</label>
                                  <input
                                    type="text"
                                    value={cert.credentialId || ''}
                                    onChange={(e) => handleArrayItemChange('certifications', idx, 'credentialId', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">URL</label>
                                  <input
                                    type="text"
                                    value={cert.url || ''}
                                    onChange={(e) => handleArrayItemChange('certifications', idx, 'url', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem('certifications')}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            + Add Certification
                          </button>
                        </div>
                      )}
                      
                      {section.type === 'projects' && (
                        <div className="space-y-4">
                          {resumeData.projects.map((project, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">Project #{idx + 1}</h4>
                                <button 
                                  onClick={() => removeArrayItem('projects', idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                  <input
                                    type="text"
                                    value={project.name || ''}
                                    onChange={(e) => handleArrayItemChange('projects', idx, 'name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">URL</label>
                                  <input
                                    type="text"
                                    value={project.url || ''}
                                    onChange={(e) => handleArrayItemChange('projects', idx, 'url', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                  <input
                                    type="date"
                                    value={project.startDate || ''}
                                    onChange={(e) => handleArrayItemChange('projects', idx, 'startDate', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                                  <input
                                    type="date"
                                    value={project.endDate || ''}
                                    onChange={(e) => handleArrayItemChange('projects', idx, 'endDate', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                  rows={2}
                                  value={project.description || ''}
                                  onChange={(e) => handleArrayItemChange('projects', idx, 'description', e.target.value)}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Technologies</label>
                                <div className="space-y-2">
                                  {project.technologies && project.technologies.map((tech, techIdx) => (
                                    <div key={techIdx} className="flex">
                                      <input
                                        type="text"
                                        value={tech || ''}
                                        onChange={(e) => handleTechnologiesChange(idx, techIdx, e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                      <button
                                        onClick={() => removeTechnology(idx, techIdx)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                      >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => addTechnology(idx)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                  >
                                    + Add Technology
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem('projects')}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            + Add Project
                          </button>
                        </div>
                      )}
                      
                      {section.type === 'languages' && (
                        <div className="space-y-4">
                          {resumeData.languages.map((lang, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">Language #{idx + 1}</h4>
                                <button 
                                  onClick={() => removeArrayItem('languages', idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Language</label>
                                  <input
                                    type="text"
                                    value={lang.name || ''}
                                    onChange={(e) => handleArrayItemChange('languages', idx, 'name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Proficiency</label>
                                  <select
                                    value={lang.proficiency || 'Fluent'}
                                    onChange={(e) => handleArrayItemChange('languages', idx, 'proficiency', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
                                    <option value="Basic">Basic</option>
                                    <option value="Conversational">Conversational</option>
                                    <option value="Fluent">Fluent</option>
                                    <option value="Native">Native</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem('languages')}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            + Add Language
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
                <ResumePreview resumeData={resumeData} />
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
                      if (menu) {
                        menu.classList.toggle('hidden');
                      }
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