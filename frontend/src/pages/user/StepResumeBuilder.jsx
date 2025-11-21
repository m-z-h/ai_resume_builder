import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchResumeById, createResume, updateResume, setCurrentResume } from '../../store/resumeSlice';
import AIGenerateButton from '../../components/AIGenerateButton';
import axios from 'axios';

// Import sections as separate components for better organization
import PersonalInfoSection from './sections/PersonalInfoSection';
import SummarySection from './sections/SummarySection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';
import PreviewSection from './sections/PreviewSection';

const StepResumeBuilder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentResume, loading } = useSelector(state => state.resumes);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    title: '',
    personalInfo: { firstName: '', lastName: '', email: '', phone: '', address: '', linkedin: '', website: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    sectionsCompleted: { personalInfo: false, summary: false, experience: false, education: false, skills: false, projects: false, certifications: false },
    designSettings: { template: 'modern', fontFamily: 'Inter', fontSize: 'medium', colorTheme: 'blue', layout: 'single-column' }
  });

  const steps = [
    { id: 'personalInfo', title: 'Personal Details', component: PersonalInfoSection },
    { id: 'summary', title: 'Summary', component: SummarySection },
    { id: 'experience', title: 'Experience', component: ExperienceSection },
    { id: 'education', title: 'Education', component: EducationSection },
    { id: 'skills', title: 'Skills', component: SkillsSection },
    { id: 'projects', title: 'Projects', component: ProjectsSection },
    { id: 'certifications', title: 'Certifications', component: CertificationsSection },
    { id: 'preview', title: 'Preview & Design', component: PreviewSection }
  ];

  useEffect(() => {
    if (id) dispatch(fetchResumeById(id));
    else dispatch(setCurrentResume(null));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentResume) setResumeData(currentResume);
  }, [currentResume]);

  const saveSection = async (sectionName) => {
    const updatedData = { ...resumeData, sectionsCompleted: { ...resumeData.sectionsCompleted, [sectionName]: true } };
    setResumeData(updatedData);
    
    try {
      if (id) {
        await dispatch(updateResume({ id, resumeData: updatedData })).unwrap();
      } else {
        const result = await dispatch(createResume(updatedData)).unwrap();
        navigate(`/resume/step-builder/${result._id}`, { replace: true });
      }
      return true;
    } catch (error) {
      console.error('Error saving section:', error);
      return false;
    }
  };

  const handleNext = async () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.id !== 'preview') {
      const saved = await saveSection(currentStepData.id);
      if (saved && currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{id ? 'Edit Resume' : 'Create Your Resume'}</h1>
          <p className="text-gray-600">Complete each section step by step</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button onClick={() => setCurrentStep(index)} className={`flex flex-col items-center min-w-[100px] ${index === currentStep ? 'opacity-100' : 'opacity-50 hover:opacity-75'} transition-opacity`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${resumeData.sectionsCompleted[step.id] ? 'bg-green-500 text-white' : index === currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {resumeData.sectionsCompleted[step.id] ? '✓' : index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">{step.title}</span>
                </button>
                {index < steps.length - 1 && <div className="w-12 h-1 bg-gray-300 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <CurrentStepComponent resumeData={resumeData} setResumeData={setResumeData} />
          
          <div className="mt-8 flex justify-between">
            <button onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)} disabled={currentStep === 0} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button onClick={handleNext} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700">
              {currentStep === steps.length - 1 ? 'Save & Finish' : 'Save & Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepResumeBuilder;
