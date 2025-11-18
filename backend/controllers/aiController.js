import asyncHandler from 'express-async-handler';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// @desc    Generate resume content using AI
// @route   POST /api/ai/generate
// @access  Private
const generateResumeContent = asyncHandler(async (req, res) => {
  try {
    const { jobRole, experienceLevel, additionalInfo } = req.body;
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if no API key
      const mockResponse = {
        personalInfo: {
          summary: `Experienced ${jobRole} professional with expertise in relevant technologies and methodologies.`
        },
        experience: [
          {
            company: "Tech Company",
            position: jobRole,
            startDate: "2020-01-01",
            endDate: "2023-01-01",
            isCurrent: false,
            description: "Key responsibilities and achievements in this role.",
            achievements: [
              "Achievement 1 with measurable impact",
              "Achievement 2 demonstrating skills",
              "Achievement 3 showing growth"
            ]
          }
        ],
        skills: [
          { name: "Relevant Skill 1", level: "Advanced" },
          { name: "Relevant Skill 2", level: "Intermediate" },
          { name: "Relevant Skill 3", level: "Expert" }
        ]
      };
      
      res.json({
        success: true,
        data: mockResponse,
        message: "Resume content generated successfully (mock data)"
      });
      return;
    }
    
    // Prepare prompt for OpenAI
    const prompt = `Generate a professional resume for a ${experienceLevel} ${jobRole}. 
    Additional information: ${additionalInfo || 'None provided'}.
    
    Please provide the following sections in JSON format:
    1. Personal summary (2-3 sentences)
    2. Work experience (1-2 positions with company, role, dates, and 3-5 achievements each)
    3. Skills (8-12 relevant skills with proficiency levels)
    
    Format the response as valid JSON with the following structure:
    {
      "personalInfo": {
        "summary": "Professional summary here"
      },
      "experience": [
        {
          "company": "Company Name",
          "position": "Job Title",
          "startDate": "YYYY-MM-DD",
          "endDate": "YYYY-MM-DD",
          "isCurrent": false,
          "description": "Role description",
          "achievements": ["Achievement 1", "Achievement 2"]
        }
      ],
      "skills": [
        {"name": "Skill Name", "level": "Beginner|Intermediate|Advanced|Expert"}
      ]
    }`;
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Generate concise, professional resume content in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Parse the AI response
    const aiContent = response.data.choices[0].message.content;
    let parsedContent;
    
    try {
      // Try to parse as JSON directly
      parsedContent = JSON.parse(aiContent);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = aiContent.match(/```(?:json)?\s*({.*?})\s*```/s);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }
    
    res.json({
      success: true,
      data: parsedContent,
      message: "Resume content generated successfully"
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate resume content',
      error: error.message
    });
  }
});

// @desc    Improve section with ATS-friendly enhancement
// @route   POST /api/ai/improveSection
// @access  Private
const improveSection = asyncHandler(async (req, res) => {
  try {
    const { section, content, jobRole } = req.body;
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if no API key
      const mockResponse = {
        improvedContent: `Enhanced ${section} content with stronger action verbs and quantifiable metrics.`,
        suggestions: [
          "Add more specific metrics",
          "Use stronger action verbs",
          "Include relevant keywords"
        ]
      };
      
      res.json({
        success: true,
        data: mockResponse,
        message: "Section improved successfully (mock data)"
      });
      return;
    }
    
    // Prepare prompt for OpenAI
    const prompt = `Improve the following ${section} section for a ${jobRole} resume to make it more ATS-friendly:
    
    Current content:
    ${JSON.stringify(content, null, 2)}
    
    Please provide:
    1. An improved version of the content with stronger action verbs, quantifiable metrics, and relevant keywords
    2. Specific suggestions for further improvement
    
    Format the response as valid JSON with the following structure:
    {
      "improvedContent": "Improved content here",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    }`;
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer specializing in ATS optimization. Provide concise, impactful improvements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Parse the AI response
    const aiContent = response.data.choices[0].message.content;
    let parsedContent;
    
    try {
      // Try to parse as JSON directly
      parsedContent = JSON.parse(aiContent);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = aiContent.match(/```(?:json)?\s*({.*?})\s*```/s);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }
    
    res.json({
      success: true,
      data: parsedContent,
      message: "Section improved successfully"
    });
  } catch (error) {
    console.error('AI Improvement Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to improve section',
      error: error.message
    });
  }
});

// @desc    Generate ATS score and suggestions
// @route   POST /api/ai/atsScore
// @access  Private
const generateAtsScore = asyncHandler(async (req, res) => {
  try {
    const { resumeContent } = req.body;
    
    // This would integrate with an ATS scoring engine in a real implementation
    // For now, we'll return mock data with some logic based on resume content
    const mockResponse = {
      overallScore: 85,
      keywordMatch: {
        score: 90,
        matchedKeywords: ["JavaScript", "React", "Node.js"],
        missingKeywords: ["TypeScript", "AWS", "Docker"]
      },
      formatting: {
        score: 80,
        issues: ["Inconsistent bullet points", "Missing metrics"],
        suggestions: ["Standardize bullet points", "Add quantifiable metrics"]
      },
      actionVerbs: {
        score: 75,
        usedVerbs: ["managed", "developed"],
        suggestedVerbs: ["orchestrated", "pioneered", "optimized"]
      },
      skillAnalysis: {
        hardSkills: {
          score: 88,
          identified: ["JavaScript", "React", "Node.js", "MongoDB"]
        },
        softSkills: {
          score: 70,
          identified: ["Leadership", "Communication"]
        }
      },
      lengthCheck: {
        score: 95,
        currentPageCount: 1,
        recommendedPageCount: 1
      },
      weakSentences: [
        {
          sentence: "Responsible for development tasks",
          suggestions: ["Add specific technologies", "Include measurable outcomes"]
        }
      ],
      detailedFeedback: "Your resume is well-structured and includes relevant keywords. To improve further, add more quantifiable metrics and include the missing technical keywords."
    };
    
    res.json({
      success: true,
      data: mockResponse,
      message: "ATS score generated successfully"
    });
  } catch (error) {
    console.error('ATS Score Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ATS score',
      error: error.message
    });
  }
});

// @desc    Rewrite resume for job description
// @route   POST /api/ai/rewriteJobSpecific
// @access  Private
const rewriteForJobDescription = asyncHandler(async (req, res) => {
  try {
    const { resumeContent, jobDescription } = req.body;
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if no API key
      const mockResponse = {
        rewrittenResume: {
          ...resumeContent,
          experience: resumeContent.experience.map(exp => ({
            ...exp,
            achievements: exp.achievements.map(ach => 
              `Tailored achievement for job description: ${ach}`
            )
          }))
        },
        matchedKeywords: ["JavaScript", "React", "Node.js"],
        suggestions: [
          "Emphasize experience with cloud technologies",
          "Highlight project management skills",
          "Include specific tools mentioned in job description"
        ]
      };
      
      res.json({
        success: true,
        data: mockResponse,
        message: "Resume rewritten for job description successfully (mock data)"
      });
      return;
    }
    
    // Prepare prompt for OpenAI
    const prompt = `Rewrite the following resume to better match the job description provided.
    
    Job Description:
    ${jobDescription}
    
    Current Resume:
    ${JSON.stringify(resumeContent, null, 2)}
    
    Please provide:
    1. A rewritten version of the resume that better matches the job description
    2. Keywords from the job description that match the resume
    3. Suggestions for further improvement
    
    Format the response as valid JSON with the following structure:
    {
      "rewrittenResume": { /* rewritten resume object */ },
      "matchedKeywords": ["Keyword 1", "Keyword 2"],
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    }`;
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer specializing in tailoring resumes for specific job descriptions. Provide concise, impactful improvements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Parse the AI response
    const aiContent = response.data.choices[0].message.content;
    let parsedContent;
    
    try {
      // Try to parse as JSON directly
      parsedContent = JSON.parse(aiContent);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = aiContent.match(/```(?:json)?\s*({.*?})\s*```/s);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }
    
    res.json({
      success: true,
      data: parsedContent,
      message: "Resume rewritten for job description successfully"
    });
  } catch (error) {
    console.error('Job-Specific Rewrite Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rewrite resume for job description',
      error: error.message
    });
  }
});

// @desc    Extract matching and missing keywords
// @route   POST /api/ai/keywordExtract
// @access  Private
const extractKeywords = asyncHandler(async (req, res) => {
  try {
    const { resumeContent, jobDescription } = req.body;
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if no API key
      const mockResponse = {
        matchingKeywords: ["JavaScript", "React", "Node.js", "MongoDB"],
        missingKeywords: ["TypeScript", "AWS", "Docker", "Kubernetes"],
        recommendedKeywords: ["TypeScript", "AWS", "Docker"]
      };
      
      res.json({
        success: true,
        data: mockResponse,
        message: "Keywords extracted successfully (mock data)"
      });
      return;
    }
    
    // Prepare prompt for OpenAI
    const prompt = `Extract keywords from the following job description and compare them with the resume content.
    
    Job Description:
    ${jobDescription}
    
    Resume Content:
    ${JSON.stringify(resumeContent, null, 2)}
    
    Please provide:
    1. Keywords from the job description that match the resume
    2. Keywords from the job description that are missing from the resume
    3. Recommended keywords to add to the resume
    
    Format the response as valid JSON with the following structure:
    {
      "matchingKeywords": ["Keyword 1", "Keyword 2"],
      "missingKeywords": ["Keyword 3", "Keyword 4"],
      "recommendedKeywords": ["Keyword 5", "Keyword 6"]
    }`;
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in keyword analysis for job applications. Extract and compare keywords accurately.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Parse the AI response
    const aiContent = response.data.choices[0].message.content;
    let parsedContent;
    
    try {
      // Try to parse as JSON directly
      parsedContent = JSON.parse(aiContent);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = aiContent.match(/```(?:json)?\s*({.*?})\s*```/s);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }
    
    res.json({
      success: true,
      data: parsedContent,
      message: "Keywords extracted successfully"
    });
  } catch (error) {
    console.error('Keyword Extraction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract keywords',
      error: error.message
    });
  }
});

export {
  generateResumeContent,
  improveSection,
  generateAtsScore,
  rewriteForJobDescription,
  extractKeywords
};