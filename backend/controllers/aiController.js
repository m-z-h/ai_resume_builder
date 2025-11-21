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
    
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }
    
    // Prepare prompt for Groq
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
    
    // Call Groq API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
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
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'AI Resume Builder'
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
    
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }
    
    // Prepare prompt for Groq
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
    
    // Call Groq API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
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
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'AI Resume Builder'
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
    
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }
    
    // Prepare prompt for Groq
    const prompt = `Analyze the following resume content and provide an ATS (Applicant Tracking System) score with detailed feedback:
    
    Resume Content:
    ${JSON.stringify(resumeContent, null, 2)}
    
    Please provide a comprehensive ATS analysis including:
    1. Overall ATS score (0-100)
    2. Keyword match analysis with matched and missing keywords
    3. Formatting assessment with issues and suggestions
    4. Action verbs evaluation with suggestions for stronger verbs
    5. Skill analysis for both hard and soft skills
    6. Length check and recommendations
    7. Identification of weak sentences with improvement suggestions
    8. Detailed feedback summary
    
    Format the response as valid JSON with the following structure:
    {
      "overallScore": 85,
      "keywordMatch": {
        "score": 90,
        "matchedKeywords": ["Keyword 1", "Keyword 2"],
        "missingKeywords": ["Keyword 3", "Keyword 4"]
      },
      "formatting": {
        "score": 80,
        "issues": ["Issue 1", "Issue 2"],
        "suggestions": ["Suggestion 1", "Suggestion 2"]
      },
      "actionVerbs": {
        "score": 75,
        "usedVerbs": ["Verb 1", "Verb 2"],
        "suggestedVerbs": ["Verb 3", "Verb 4"]
      },
      "skillAnalysis": {
        "hardSkills": {
          "score": 88,
          "identified": ["Skill 1", "Skill 2"]
        },
        "softSkills": {
          "score": 70,
          "identified": ["Skill 3", "Skill 4"]
        }
      },
      "lengthCheck": {
        "score": 95,
        "currentPageCount": 1,
        "recommendedPageCount": 1
      },
      "weakSentences": [
        {
          "sentence": "Weak sentence example",
          "suggestions": ["Suggestion 1", "Suggestion 2"]
        }
      ],
      "detailedFeedback": "Detailed feedback summary"
    }`;
    
    // Call Groq API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in ATS (Applicant Tracking Systems) and resume optimization. Provide detailed, accurate ATS analysis with actionable feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'AI Resume Builder'
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
    
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }
    
    // Prepare prompt for Groq
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
    
    // Call Groq API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
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
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'AI Resume Builder'
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
    
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }
    
    // Prepare prompt for Groq
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
    
    // Call Groq API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
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
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'AI Resume Builder'
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

// Helper function to try multiple free models
const tryMultipleModels = async (messages, maxTokens = 200) => {
  const freeModels = [
    'microsoft/phi-3-mini-128k-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'qwen/qwen-2-7b-instruct:free'
  ];
  
  for (const model of freeModels) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages,
          temperature: 0.7,
          max_tokens: maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'AI Resume Builder'
          }
        }
      );
      console.log(`✅ Success with model: ${model}`);
      return response;
    } catch (error) {
      const status = error.response?.status;
      if (status === 429) {
        console.log(`⏭️ Model ${model} is rate-limited, trying next...`);
        continue;
      } else if (status === 404) {
        console.log(`⏭️ Model ${model} not found, trying next...`);
        continue;
      }
      // For other errors, try next model anyway
      console.log(`⏭️ Model ${model} failed (${status}), trying next...`);
      continue;
    }
  }
  
  throw new Error('All free models are currently rate-limited. Please try again in a few minutes or add credits to OpenRouter.');
};

// @desc    Generate professional summary
// @route   POST /api/ai/generateSummary
// @access  Private
const generateSummary = asyncHandler(async (req, res) => {
  try {
    const { personalInfo, experience, skills } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }
    
    const prompt = `Generate a professional summary (2-3 sentences) for a resume based on the following information:
    
    Name: ${personalInfo?.firstName} ${personalInfo?.lastName}
    Experience: ${experience?.map(exp => `${exp.position} at ${exp.company}`).join(', ') || 'Not provided'}
    Skills: ${skills?.map(s => s.name || s).join(', ') || 'Not provided'}
    
    Create a compelling professional summary that highlights key strengths and career focus. Return ONLY the summary text, no JSON or extra formatting.`;
    
    const response = await tryMultipleModels([
      {
        role: 'system',
        content: 'You are a professional resume writer. Generate concise, impactful professional summaries.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 200);
    
    const summary = response.data.choices[0].message.content.trim();
    
    res.json({
      success: true,
      data: { summary },
      message: "Summary generated successfully"
    });
  } catch (error) {
    console.error('AI Summary Generation Error:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate summary',
      error: error.message
    });
  }
});

// @desc    Generate experience description
// @route   POST /api/ai/generateExperienceDescription
// @access  Private
const generateExperienceDescription = asyncHandler(async (req, res) => {
  try {
    const { jobTitle, company, responsibilities } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }
    
    const prompt = `Generate a professional job description with 3-5 bullet points for the following role:
    
    Job Title: ${jobTitle}
    Company: ${company}
    Responsibilities: ${responsibilities || 'General responsibilities for this role'}
    
    Create impactful bullet points that:
    - Start with strong action verbs
    - Include quantifiable achievements where possible
    - Highlight key skills and technologies
    - Are ATS-friendly
    
    Return the bullet points as a JSON array of strings. Format: {"bulletPoints": ["point 1", "point 2", ...]}`;
    
    const response = await tryMultipleModels([
      {
        role: 'system',
        content: 'You are a professional resume writer. Generate concise, impactful job descriptions with strong action verbs and quantifiable achievements.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 300);
    
    const aiContent = response.data.choices[0].message.content;
    let parsedContent;
    
    try {
      parsedContent = JSON.parse(aiContent);
    } catch (parseError) {
      const jsonMatch = aiContent.match(/```(?:json)?\s*({.*?})\s*```/s);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1]);
      } else {
        // Fallback: split by newlines and filter
        const bulletPoints = aiContent.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^[-•*]\s*/, '').trim())
          .filter(line => line.length > 0);
        parsedContent = { bulletPoints };
      }
    }
    
    res.json({
      success: true,
      data: parsedContent,
      message: "Experience description generated successfully"
    });
  } catch (error) {
    console.error('AI Experience Description Error:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate experience description',
      error: error.message
    });
  }
});

// @desc    Generate project description
// @route   POST /api/ai/generateProjectDescription
// @access  Private
const generateProjectDescription = asyncHandler(async (req, res) => {
  try {
    const { projectTitle, technologies, projectPurpose } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Groq API key not configured'
      });
    }
    
    const prompt = `Generate a professional project description (2-3 sentences) for:
    
    Project: ${projectTitle}
    Technologies: ${technologies || 'Not specified'}
    Purpose: ${projectPurpose || 'General project'}
    
    Create a concise description that:
    - Explains what the project does
    - Highlights key technologies used
    - Mentions impact or results if applicable
    - Is professional and ATS-friendly
    
    Return ONLY the description text, no JSON or extra formatting.`;
    
    const response = await tryMultipleModels([
      {
        role: 'system',
        content: 'You are a professional resume writer. Generate concise, impactful project descriptions.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 200);
    
    const description = response.data.choices[0].message.content.trim();
    
    res.json({
      success: true,
      data: { description },
      message: "Project description generated successfully"
    });
  } catch (error) {
    console.error('AI Project Description Error:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate project description',
      error: error.message
    });
  }
});

export {
  generateResumeContent,
  improveSection,
  generateAtsScore,
  rewriteForJobDescription,
  extractKeywords,
  generateSummary,
  generateExperienceDescription,
  generateProjectDescription
};
