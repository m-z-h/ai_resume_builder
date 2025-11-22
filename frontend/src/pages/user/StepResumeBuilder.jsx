import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchResumeById, createResume, updateResume, setCurrentResume } from '../../store/resumeSlice';
import AIGenerateButton from '../../components/AIGenerateButton';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import sections as separate components for better organization
import TemplateSelectionSection from './sections/TemplateSelectionSection';
import PersonalInfoSection from './sections/PersonalInfoSection';
import SummarySection from './sections/SummarySection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';
import AdditionalInfoSection from './sections/AdditionalInfoSection';
import PreviewSection from './sections/PreviewSection';

const StepResumeBuilder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentResume, loading } = useSelector(state => state.resumes);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    title: '',
    templateId: null,
    personalInfo: { firstName: '', lastName: '', email: '', phone: '', address: '', linkedin: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [], // Initialize as empty array
    projects: [],
    certifications: [],
    customSections: [],
    sectionsCompleted: { 
      templateSelection: false,
      personalInfo: false, 
      summary: false, 
      experience: false, 
      education: false, 
      skills: false, 
      projects: false, 
      certifications: false, 
      additionalInfo: false,
      preview: false
    },
    designSettings: { template: 'blank', fontFamily: 'Inter, sans-serif', fontSize: '16px', colorTheme: 'blue', layout: 'single-column' }
  });

  const steps = [
    { id: 'templateSelection', title: 'Choose Template', component: TemplateSelectionSection },
    { id: 'personalInfo', title: 'Personal Details', component: PersonalInfoSection },
    { id: 'summary', title: 'Summary', component: SummarySection },
    { id: 'experience', title: 'Experience', component: ExperienceSection },
    { id: 'education', title: 'Education', component: EducationSection },
    { id: 'skills', title: 'Skills', component: SkillsSection },
    { id: 'projects', title: 'Projects', component: ProjectsSection },
    { id: 'certifications', title: 'Certifications (Optional)', component: CertificationsSection },
    { id: 'additionalInfo', title: 'Additional Info (Optional)', component: AdditionalInfoSection },
    { id: 'preview', title: 'Preview & Finalize', component: PreviewSection }
  ];

  useEffect(() => {
    if (id) dispatch(fetchResumeById(id));
    else dispatch(setCurrentResume(null));
  }, [id, dispatch]);

  useEffect(() => {
    // Ensure skills is always an array when loading resume data
    if (currentResume) {
      const updatedResume = { ...currentResume };
      if (!Array.isArray(updatedResume.skills)) {
        updatedResume.skills = updatedResume.skills ? [updatedResume.skills] : [];
      }
      setResumeData(updatedResume);
    }
  }, [currentResume]);

  const saveSection = async (sectionName) => {
    // Generate title if not exists
    let dataToSave = { ...resumeData };
    if (!dataToSave.title || dataToSave.title.trim() === '') {
      const firstName = dataToSave.personalInfo?.firstName || '';
      const lastName = dataToSave.personalInfo?.lastName || '';
      dataToSave.title = `${firstName} ${lastName}`.trim() || 'Untitled Resume';
    }
    
    // Mark section as completed
    dataToSave.sectionsCompleted = { ...dataToSave.sectionsCompleted, [sectionName]: true };
    setResumeData(dataToSave);
    
    try {
      if (id) {
        const result = await dispatch(updateResume({ id, resumeData: dataToSave })).unwrap();
        toast.success(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section saved successfully!`);
        return true;
      } else {
        const result = await dispatch(createResume(dataToSave)).unwrap();
        toast.success(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section saved successfully!`);
        navigate(`/resume/step-builder/${result._id}`, { replace: true });
        return result._id;
      }
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Failed to save section. Please try again.');
      return false;
    }
  };

  const handleSaveSection = async () => {
    const currentStepData = steps[currentStep];
    const saved = await saveSection(currentStepData.id);
    if (saved) {
      toast.success('Section saved successfully!');
    }
  };

  const handleNext = async () => {
    const currentStepData = steps[currentStep];
    const saved = await saveSection(currentStepData.id);
    if (saved && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{id ? 'Edit Resume' : 'Create Your Resume'}</h1>
          <p className="text-gray-600">Complete each section step by step</p>
        </div>

        {/* Progress Steps - Horizontal on Desktop */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 hidden lg:block">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button 
                  onClick={() => setCurrentStep(index)} 
                  className={`flex flex-col items-center min-w-[100px] ${index === currentStep ? 'opacity-100' : 'opacity-50 hover:opacity-75'} transition-opacity`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${
                    resumeData.sectionsCompleted[step.id] 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : index === currentStep 
                        ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-200' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {resumeData.sectionsCompleted[step.id] ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm font-medium text-center ${index === currentStep ? 'text-indigo-600' : 'text-gray-700'}`}>
                    {step.title}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 transition-all ${
                    resumeData.sectionsCompleted[step.id] ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Steps - Vertical on Mobile */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 lg:hidden">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resume Sections</h3>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  index === currentStep 
                    ? 'bg-indigo-50 border-2 border-indigo-600' 
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 ${
                  resumeData.sectionsCompleted[step.id] 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {resumeData.sectionsCompleted[step.id] ? '✓' : index + 1}
                </div>
                <span className={`text-sm font-medium ${index === currentStep ? 'text-indigo-600' : 'text-gray-700'}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <CurrentStepComponent resumeData={resumeData} setResumeData={setResumeData} />
          
          <div className="mt-8 flex justify-between items-center">
            <button 
              onClick={handlePrevious} 
              disabled={currentStep === 0} 
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous Section
            </button>
            
            <div className="flex gap-3">
              <button 
                onClick={handleSaveSection} 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                💾 Save Section
              </button>
              
              {currentStep < steps.length - 1 && (
                <button 
                  onClick={handleNext} 
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                >
                  Next Section →
                </button>
              )}
              
              {currentStep === steps.length - 1 && (
                <button 
                  onClick={handleSaveSection} 
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                >
                  ✓ Finalize Resume
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepResumeBuilder;