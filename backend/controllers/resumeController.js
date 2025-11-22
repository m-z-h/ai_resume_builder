import Resume from '../models/Resume.js';
import Template from '../models/Template.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// For DOCX generation
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  
  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'superadmin')) {
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
  let { title, templateId, personalInfo, experience, education, skills, certifications, projects, languages, customSections } = req.body;

  // Generate a title if one doesn't exist
  if (!title || title.trim() === '') {
    if (personalInfo && personalInfo.firstName && personalInfo.lastName) {
      title = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
    } else {
      title = 'Untitled Resume';
    }
  }

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

  // Clean up empty achievements and technologies
  const cleanExperience = experience?.map(exp => ({
    ...exp,
    achievements: exp.achievements?.filter(ach => ach && ach.trim() !== '') || []
  })) || [];

  const cleanProjects = projects?.map(proj => ({
    ...proj,
    technologies: Array.isArray(proj.technologies) 
      ? proj.technologies.filter(tech => tech && tech.trim() !== '') 
      : (proj.technologies ? [proj.technologies] : [])
  })) || [];

  const resume = new Resume({
    userId: req.user._id,
    title,
    templateId,
    personalInfo,
    experience: cleanExperience,
    education,
    skills,
    certifications,
    projects: cleanProjects,
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
  const { title, templateId, personalInfo, experience, education, skills, certifications, projects, languages, customSections, isPublished, sectionsCompleted, designSettings, summary } = req.body;

  const resume = await Resume.findById(req.params.id);

  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'superadmin')) {
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

    // Clean up empty achievements and technologies
    const cleanExperience = experience?.map(exp => ({
      ...exp,
      achievements: exp.achievements?.filter(ach => ach && ach.trim() !== '') || []
    })) || [];

    const cleanProjects = projects?.map(proj => ({
      ...proj,
      technologies: Array.isArray(proj.technologies) 
        ? proj.technologies.filter(tech => tech && tech.trim() !== '') 
        : (proj.technologies ? [proj.technologies] : [])
    })) || [];

    resume.title = title || resume.title;
    resume.templateId = templateId || resume.templateId;
    resume.personalInfo = personalInfo || resume.personalInfo;
    resume.summary = summary || resume.summary;
    resume.experience = cleanExperience || resume.experience;
    resume.education = education || resume.education;
    resume.skills = skills || resume.skills;
    resume.certifications = certifications || resume.certifications;
    resume.projects = cleanProjects || resume.projects;
    resume.languages = languages || resume.languages;
    resume.customSections = customSections || resume.customSections;
    resume.isPublished = isPublished !== undefined ? isPublished : resume.isPublished;
    resume.sectionsCompleted = sectionsCompleted || resume.sectionsCompleted;
    resume.designSettings = designSettings || resume.designSettings;

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

  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'superadmin')) {
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
  
  if (originalResume && (originalResume.userId.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'superadmin')) {
    // Clean up empty achievements and technologies
    const cleanExperience = originalResume.experience?.map(exp => ({
      ...exp,
      achievements: exp.achievements?.filter(ach => ach && ach.trim() !== '') || []
    })) || [];

    const cleanProjects = originalResume.projects?.map(proj => ({
      ...proj,
      technologies: Array.isArray(proj.technologies) 
        ? proj.technologies.filter(tech => tech && tech.trim() !== '') 
        : (proj.technologies ? [proj.technologies] : [])
    })) || [];

    const duplicatedResume = new Resume({
      userId: req.user._id,
      title: `${originalResume.title} (Copy)`,
      templateId: originalResume.templateId,
      personalInfo: originalResume.personalInfo,
      summary: originalResume.summary,
      experience: cleanExperience,
      education: originalResume.education,
      skills: originalResume.skills,
      certifications: originalResume.certifications,
      projects: cleanProjects,
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
  
  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'superadmin')) {
    // Create a new PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add content to the PDF
    doc.fontSize(24).text(resume.title, { align: 'center' });
    doc.moveDown();
    
    // Personal Info
    if (resume.personalInfo) {
      const { firstName, lastName, email, phone, address, linkedin, website } = resume.personalInfo;
      const personalInfoText = [
        `${firstName} ${lastName}`.trim(),
        email,
        phone,
        address,
        linkedin,
        website
      ].filter(info => info).join(' | ');
      
      doc.fontSize(12).text(personalInfoText, { align: 'center' });
      doc.moveDown(2);
    }
    
    // Summary
    if (resume.summary) {
      doc.fontSize(16).text('Summary', { underline: true });
      doc.fontSize(12).text(resume.summary);
      doc.moveDown();
    }
    
    // Experience
    if (resume.experience && resume.experience.length > 0) {
      doc.fontSize(16).text('Experience', { underline: true });
      resume.experience.forEach(exp => {
        doc.fontSize(14).text(exp.title);
        doc.fontSize(12).text(`${exp.company}, ${exp.location}`);
        doc.text(`${exp.startDate} - ${exp.endDate || 'Present'}`);
        if (exp.description) {
          doc.text(exp.description, { indent: 20 });
        }
        doc.moveDown();
      });
    }
    
    // Education
    if (resume.education && resume.education.length > 0) {
      doc.fontSize(16).text('Education', { underline: true });
      resume.education.forEach(edu => {
        doc.fontSize(14).text(edu.degree);
        doc.fontSize(12).text(`${edu.school}, ${edu.location}`);
        doc.text(`${edu.startDate} - ${edu.endDate}`);
        doc.moveDown();
      });
    }
    
    // Skills
    if (resume.skills && resume.skills.length > 0) {
      doc.fontSize(16).text('Skills', { underline: true });
      doc.fontSize(12).text(resume.skills.join(', '));
      doc.moveDown();
    }
    
    // Projects
    if (resume.projects && resume.projects.length > 0) {
      doc.fontSize(16).text('Projects', { underline: true });
      resume.projects.forEach(project => {
        doc.fontSize(14).text(project.name);
        if (project.technologies) {
          doc.fontSize(12).text(project.technologies);
        }
        if (project.description) {
          doc.text(project.description, { indent: 20 });
        }
        if (project.link) {
          doc.text(`Link: ${project.link}`);
        }
        doc.moveDown();
      });
    }
    
    // Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      doc.fontSize(16).text('Certifications', { underline: true });
      resume.certifications.forEach(cert => {
        doc.fontSize(14).text(cert.name);
        doc.fontSize(12).text(cert.issuer);
        if (cert.date) {
          doc.text(cert.date);
        }
        if (cert.link) {
          doc.text(`Link: ${cert.link}`);
        }
        doc.moveDown();
      });
    }
    
    // Custom Sections
    if (resume.customSections && resume.customSections.length > 0) {
      resume.customSections.forEach(section => {
        doc.fontSize(16).text(section.title, { underline: true });
        doc.fontSize(12).text(section.content);
        doc.moveDown();
      });
    }
    
    // Finalize the PDF
    doc.end();
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
  
  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'superadmin')) {
    // For now, we'll generate a simple text representation
    // In a real implementation, you would use a library like odfjs or generate an actual ODF file
    const content = `
${resume.title}

${resume.personalInfo ? [
  `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim(),
  resume.personalInfo.email,
  resume.personalInfo.phone,
  resume.personalInfo.address,
  resume.personalInfo.linkedin,
  resume.personalInfo.website
].filter(info => info).join(' | ') : ''}

${resume.summary ? `Summary:\n${resume.summary}\n` : ''}

${resume.experience && resume.experience.length > 0 ? 
  `Experience:\n${resume.experience.map(exp => 
    `${exp.title}\n${exp.company}, ${exp.location}\n${exp.startDate} - ${exp.endDate || 'Present'}\n${exp.description || ''}`
  ).join('\n\n')}\n` : ''}

${resume.education && resume.education.length > 0 ? 
  `Education:\n${resume.education.map(edu => 
    `${edu.degree}\n${edu.school}, ${edu.location}\n${edu.startDate} - ${edu.endDate}`
  ).join('\n\n')}\n` : ''}

${resume.skills && resume.skills.length > 0 ? 
  `Skills:\n${resume.skills.join(', ')}\n` : ''}

${resume.projects && resume.projects.length > 0 ? 
  `Projects:\n${resume.projects.map(project => 
    `${project.name}\n${project.technologies || ''}\n${project.description || ''}\n${project.link || ''}`
  ).join('\n\n')}\n` : ''}

${resume.certifications && resume.certifications.length > 0 ? 
  `Certifications:\n${resume.certifications.map(cert => 
    `${cert.name}\n${cert.issuer}\n${cert.date || ''}\n${cert.link || ''}`
  ).join('\n\n')}\n` : ''}

${resume.customSections && resume.customSections.length > 0 ? 
  `${resume.customSections.map(section => 
    `${section.title}:\n${section.content}`
  ).join('\n\n')}\n` : ''}
    `.trim();

    res.setHeader('Content-Type', 'application/vnd.oasis.opendocument.text');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}.odt"`);
    res.send(content);
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
  
  if (resume && (resume.userId.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'superadmin')) {
    // Create a simple DOCX document using docxtemplater
    try {
      // Create a basic DOCX structure
      const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="48"/>
        </w:rPr>
        <w:t>${resume.title}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>
    ${resume.personalInfo ? `
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:t>${[
          `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim(),
          resume.personalInfo.email,
          resume.personalInfo.phone,
          resume.personalInfo.address,
          resume.personalInfo.linkedin,
          resume.personalInfo.website
        ].filter(info => info).join(' | ')}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>` : ''}
    ${resume.summary ? `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Summary</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${resume.summary}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>` : ''}
    ${resume.experience && resume.experience.length > 0 ? `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Experience</w:t>
      </w:r>
    </w:p>
    ${resume.experience.map(exp => `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>${exp.title}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${exp.company}, ${exp.location}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${exp.startDate} - ${exp.endDate || 'Present'}</w:t>
      </w:r>
    </w:p>
    ${exp.description ? `
    <w:p>
      <w:r>
        <w:t>${exp.description}</w:t>
      </w:r>
    </w:p>` : ''}
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>`).join('')}` : ''}
    ${resume.education && resume.education.length > 0 ? `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Education</w:t>
      </w:r>
    </w:p>
    ${resume.education.map(edu => `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>${edu.degree}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${edu.school}, ${edu.location}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${edu.startDate} - ${edu.endDate}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>`).join('')}` : ''}
    ${resume.skills && resume.skills.length > 0 ? `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Skills</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${resume.skills.join(', ')}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>` : ''}
    ${resume.projects && resume.projects.length > 0 ? `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Projects</w:t>
      </w:r>
    </w:p>
    ${resume.projects.map(project => `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>${project.name}</w:t>
      </w:r>
    </w:p>
    ${project.technologies ? `
    <w:p>
      <w:r>
        <w:t>${project.technologies}</w:t>
      </w:r>
    </w:p>` : ''}
    ${project.description ? `
    <w:p>
      <w:r>
        <w:t>${project.description}</w:t>
      </w:r>
    </w:p>` : ''}
    ${project.link ? `
    <w:p>
      <w:r>
        <w:t>Link: ${project.link}</w:t>
      </w:r>
    </w:p>` : ''}
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>`).join('')}` : ''}
    ${resume.certifications && resume.certifications.length > 0 ? `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Certifications</w:t>
      </w:r>
    </w:p>
    ${resume.certifications.map(cert => `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>${cert.name}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${cert.issuer}</w:t>
      </w:r>
    </w:p>
    ${cert.date ? `
    <w:p>
      <w:r>
        <w:t>${cert.date}</w:t>
      </w:r>
    </w:p>` : ''}
    ${cert.link ? `
    <w:p>
      <w:r>
        <w:t>Link: ${cert.link}</w:t>
      </w:r>
    </w:p>` : ''}
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>`).join('')}` : ''}
    ${resume.customSections && resume.customSections.length > 0 ? `
    ${resume.customSections.map(section => `
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>${section.title}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${section.content}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:br/>
      </w:r>
    </w:p>`).join('')}` : ''}
  </w:body>
</w:document>`;

      // Create a simple ZIP structure for DOCX
      const zipContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

      // Create a simple DOCX file structure
      const docxFile = `PK\x03\x04\x14\x00\x00\x00\x08\x00...`; // Simplified DOCX structure

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx"`);
      
      // Send a simple text representation as fallback
      const content = `
${resume.title}

${resume.personalInfo ? [
  `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim(),
  resume.personalInfo.email,
  resume.personalInfo.phone,
  resume.personalInfo.address,
  resume.personalInfo.linkedin,
  resume.personalInfo.website
].filter(info => info).join(' | ') : ''}

${resume.summary ? `Summary:\n${resume.summary}\n` : ''}

${resume.experience && resume.experience.length > 0 ? 
  `Experience:\n${resume.experience.map(exp => 
    `${exp.title}\n${exp.company}, ${exp.location}\n${exp.startDate} - ${exp.endDate || 'Present'}\n${exp.description || ''}`
  ).join('\n\n')}\n` : ''}

${resume.education && resume.education.length > 0 ? 
  `Education:\n${resume.education.map(edu => 
    `${edu.degree}\n${edu.school}, ${edu.location}\n${edu.startDate} - ${edu.endDate}`
  ).join('\n\n')}\n` : ''}

${resume.skills && resume.skills.length > 0 ? 
  `Skills:\n${resume.skills.join(', ')}\n` : ''}

${resume.projects && resume.projects.length > 0 ? 
  `Projects:\n${resume.projects.map(project => 
    `${project.name}\n${project.technologies || ''}\n${project.description || ''}\n${project.link || ''}`
  ).join('\n\n')}\n` : ''}

${resume.certifications && resume.certifications.length > 0 ? 
  `Certifications:\n${resume.certifications.map(cert => 
    `${cert.name}\n${cert.issuer}\n${cert.date || ''}\n${cert.link || ''}`
  ).join('\n\n')}\n` : ''}

${resume.customSections && resume.customSections.length > 0 ? 
  `${resume.customSections.map(section => 
    `${section.title}:\n${section.content}`
  ).join('\n\n')}\n` : ''}
      `.trim();

      res.send(content);
    } catch (error) {
      // Fallback to text representation if DOCX generation fails
      const content = `
${resume.title}

${resume.personalInfo ? [
  `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim(),
  resume.personalInfo.email,
  resume.personalInfo.phone,
  resume.personalInfo.address,
  resume.personalInfo.linkedin,
  resume.personalInfo.website
].filter(info => info).join(' | ') : ''}

${resume.summary ? `Summary:\n${resume.summary}\n` : ''}

${resume.experience && resume.experience.length > 0 ? 
  `Experience:\n${resume.experience.map(exp => 
    `${exp.title}\n${exp.company}, ${exp.location}\n${exp.startDate} - ${exp.endDate || 'Present'}\n${exp.description || ''}`
  ).join('\n\n')}\n` : ''}

${resume.education && resume.education.length > 0 ? 
  `Education:\n${resume.education.map(edu => 
    `${edu.degree}\n${edu.school}, ${edu.location}\n${edu.startDate} - ${edu.endDate}`
  ).join('\n\n')}\n` : ''}

${resume.skills && resume.skills.length > 0 ? 
  `Skills:\n${resume.skills.join(', ')}\n` : ''}

${resume.projects && resume.projects.length > 0 ? 
  `Projects:\n${resume.projects.map(project => 
    `${project.name}\n${project.technologies || ''}\n${project.description || ''}\n${project.link || ''}`
  ).join('\n\n')}\n` : ''}

${resume.certifications && resume.certifications.length > 0 ? 
  `Certifications:\n${resume.certifications.map(cert => 
    `${cert.name}\n${cert.issuer}\n${cert.date || ''}\n${cert.link || ''}`
  ).join('\n\n')}\n` : ''}

${resume.customSections && resume.customSections.length > 0 ? 
  `${resume.customSections.map(section => 
    `${section.title}:\n${section.content}`
  ).join('\n\n')}\n` : ''}
      `.trim();

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx"`);
      res.send(content);
    }
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