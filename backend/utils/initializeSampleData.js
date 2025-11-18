import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Template from '../models/Template.js';
import AtsReport from '../models/AtsReport.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
await connectDB();

const createSampleData = async () => {
  try {
    // Create a sample user
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'User@123',
      role: 'user',
      isActive: true
    });

    console.log('Sample user created:', sampleUser.email);

    // Get a template for the resume
    const template = await Template.findOne();
    
    if (!template) {
      console.log('No templates found. Please run template initialization first.');
      process.exit(1);
    }

    // Create a sample resume
    const sampleResume = await Resume.create({
      userId: sampleUser._id,
      title: 'John Doe\'s Resume',
      templateId: template._id,
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345',
        linkedin: 'linkedin.com/in/johndoe',
        website: 'johndoe.com',
        summary: 'Experienced software developer with 5 years of experience in full-stack development.'
      },
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2023-12-31'),
          isCurrent: false,
          description: 'Led development of multiple web applications using React and Node.js.',
          achievements: [
            'Increased application performance by 40%',
            'Mentored 5 junior developers',
            'Implemented CI/CD pipeline reducing deployment time by 60%'
          ]
        }
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science in Computer Science',
          fieldOfStudy: 'Computer Science',
          startDate: new Date('2015-09-01'),
          endDate: new Date('2019-05-31'),
          description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Database Systems.'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 'Advanced' },
        { name: 'React', level: 'Advanced' },
        { name: 'Node.js', level: 'Intermediate' },
        { name: 'MongoDB', level: 'Intermediate' },
        { name: 'Python', level: 'Beginner' }
      ],
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          date: new Date('2022-06-15'),
          credentialId: 'AWS-123456',
          url: 'https://aws.amazon.com/verification'
        }
      ],
      projects: [
        {
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce platform with payment integration.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          url: 'github.com/johndoe/ecommerce',
          startDate: new Date('2022-03-01'),
          endDate: new Date('2022-08-31')
        }
      ],
      languages: [
        { name: 'English', proficiency: 'Fluent' },
        { name: 'Spanish', proficiency: 'Conversational' }
      ],
      atsScore: 85
    });

    console.log('Sample resume created:', sampleResume.title);

    // Create a sample ATS report
    const sampleAtsReport = await AtsReport.create({
      resume: sampleResume._id,
      user: sampleUser._id,
      overallScore: 85,
      keywordMatch: {
        score: 90,
        matchedKeywords: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        missingKeywords: ['Angular', 'Vue.js', 'PostgreSQL']
      },
      formatting: {
        score: 80,
        issues: ['Inconsistent date formats', 'Missing section headers'],
        suggestions: ['Standardize date formats', 'Add section headers for better parsing']
      },
      actionVerbs: {
        score: 88,
        usedVerbs: ['Led', 'Implemented', 'Increased', 'Mentored'],
        suggestedVerbs: ['Optimized', 'Streamlined', 'Enhanced', 'Spearheaded']
      },
      skillAnalysis: {
        hardSkills: {
          score: 92,
          identified: ['JavaScript', 'React', 'Node.js', 'MongoDB']
        },
        softSkills: {
          score: 78,
          identified: ['Leadership', 'Communication', 'Problem-solving']
        }
      },
      lengthCheck: {
        score: 100,
        currentPageCount: 1,
        recommendedPageCount: 1
      },
      weakSentences: [
        {
          sentence: 'I worked on many projects.',
          suggestions: ['Quantify your impact: "I worked on 5+ projects."', 'Add specific details about the projects.']
        }
      ],
      fileParsingIssues: [],
      detailedFeedback: 'Overall good resume with strong technical skills. Consider adding more quantifiable achievements and standardizing formatting.'
    });

    // Update resume with ATS report reference
    await Resume.findByIdAndUpdate(sampleResume._id, {
      atsReport: sampleAtsReport._id
    });

    console.log('Sample ATS report created');

    console.log('Sample data initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing sample data:', error);
    process.exit(1);
  }
};

await createSampleData();