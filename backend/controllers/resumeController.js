import Resume from '../models/Resume.js';
import Template from '../models/Template.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
// @access  Private
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id });
  res.json(resumes);
});

// @desc    Get resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  
  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    res.json(resume);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
const createResume = asyncHandler(async (req, res) => {
  const { title, templateId, personalInfo, experience, education, skills, certifications, projects, languages, customSections } = req.body;

  // Validate template if provided
  let template = null;
  if (templateId) {
    template = await Template.findById(templateId);
    if (!template) {
      res.status(400);
      throw new Error('Template not found');
    }
    
    // Check if user has access to this template
    if (!template.isFree && !template.allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have access to this template');
    }
  }

  const resume = new Resume({
    userId: req.user._id,
    title,
    templateId,
    personalInfo,
    experience,
    education,
    skills,
    certifications,
    projects,
    languages,
    customSections
  });

  const createdResume = await resume.save();
  res.status(201).json(createdResume);
});

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = asyncHandler(async (req, res) => {
  const { title, templateId, personalInfo, experience, education, skills, certifications, projects, languages, customSections, isPublished } = req.body;

  const resume = await Resume.findById(req.params.id);

  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    // Validate template if provided
    if (templateId) {
      const template = await Template.findById(templateId);
      if (!template) {
        res.status(400);
        throw new Error('Template not found');
      }
      
      // Check if user has access to this template
      if (!template.isFree && !template.allowedRoles.includes(req.user.role)) {
        res.status(403);
        throw new Error('You do not have access to this template');
      }
    }

    resume.title = title || resume.title;
    resume.templateId = templateId || resume.templateId;
    resume.personalInfo = personalInfo || resume.personalInfo;
    resume.experience = experience || resume.experience;
    resume.education = education || resume.education;
    resume.skills = skills || resume.skills;
    resume.certifications = certifications || resume.certifications;
    resume.projects = projects || resume.projects;
    resume.languages = languages || resume.languages;
    resume.customSections = customSections || resume.customSections;
    resume.isPublished = isPublished !== undefined ? isPublished : resume.isPublished;

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    await resume.remove();
    res.json({ message: 'Resume removed' });
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
const duplicateResume = asyncHandler(async (req, res) => {
  const originalResume = await Resume.findById(req.params.id);
  
  if (originalResume && (originalResume.userId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    const duplicatedResume = new Resume({
      userId: req.user._id,
      title: `${originalResume.title} (Copy)`,
      templateId: originalResume.templateId,
      personalInfo: originalResume.personalInfo,
      experience: originalResume.experience,
      education: originalResume.education,
      skills: originalResume.skills,
      certifications: originalResume.certifications,
      projects: originalResume.projects,
      languages: originalResume.languages,
      customSections: originalResume.customSections,
      isPublished: false
    });

    const createdResume = await duplicatedResume.save();
    res.status(201).json(createdResume);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Download resume as PDF
// @route   GET /api/resumes/:id/download/pdf
// @access  Private
const downloadResumePdf = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  
  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    // In a real implementation, this would generate and return a PDF file
    // For now, we'll simulate the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`);
    res.send(`PDF content for ${resume.title}`);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Download resume as ODF
// @route   GET /api/resumes/:id/download/odf
// @access  Private
const downloadResumeOdf = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  
  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    // In a real implementation, this would generate and return an ODF file
    // For now, we'll simulate the response
    res.setHeader('Content-Type', 'application/vnd.oasis.opendocument.text');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.odt"`);
    res.send(`ODF content for ${resume.title}`);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Download resume as DOCX
// @route   GET /api/resumes/:id/download/docx
// @access  Private
const downloadResumeDocx = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  
  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    // In a real implementation, this would generate and return a DOCX file
    // For now, we'll simulate the response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.docx"`);
    res.send(`DOCX content for ${resume.title}`);
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

// @desc    Get all resumes (Admin only)
// @route   GET /api/resumes/admin/all
// @access  Private/Admin
const getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({});
  res.json(resumes);
});

export {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  downloadResumePdf,
  downloadResumeOdf,
  downloadResumeDocx,
  getAllResumes
};