import asyncHandler from 'express-async-handler';
import AtsReport from '../models/AtsReport.js';

// @desc    Generate ATS score and report
// @route   POST /api/ats/score
// @access  Private
const generateAtsScore = asyncHandler(async (req, res) => {
  try {
    const { resumeId, resumeContent } = req.body;
    const userId = req.user.id;
    
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
    
    // Create the ATS report with the AI-generated content
    const atsReportData = {
      resume: resumeId,
      user: userId,
      ...parsedContent
    };
    
    // Save the ATS report to database
    const atsReport = new AtsReport(atsReportData);
    const savedReport = await atsReport.save();
    
    res.json({
      success: true,
      data: savedReport,
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

// @desc    Get ATS report by ID
// @route   GET /api/ats/report/:id
// @access  Private
const getAtsReport = asyncHandler(async (req, res) => {
  try {
    const report = await AtsReport.findById(req.params.id)
      .populate('resume', 'title')
      .populate('user', 'name email');
    
    if (report) {
      // Check if user owns this report or is admin
      if (report.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        res.status(403);
        throw new Error('Not authorized to view this report');
      }
      
      res.json({
        success: true,
        data: report
      });
    } else {
      res.status(404);
      throw new Error('ATS report not found');
    }
  } catch (error) {
    console.error('Get ATS Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ATS report',
      error: error.message
    });
  }
});

// @desc    Get ATS reports by resume ID
// @route   GET /api/ats/reports/resume/:resumeId
// @access  Private
const getAtsReportsByResume = asyncHandler(async (req, res) => {
  try {
    const reports = await AtsReport.find({ resume: req.params.resumeId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // Filter reports to only show user's own reports or all if admin
    const filteredReports = reports.filter(report => 
      report.user.toString() === req.user.id || 
      req.user.role === 'admin' || 
      req.user.role === 'superadmin'
    );
    
    res.json({
      success: true,
      data: filteredReports
    });
  } catch (error) {
    console.error('Get ATS Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ATS reports',
      error: error.message
    });
  }
});

export {
  generateAtsScore,
  getAtsReport,
  getAtsReportsByResume
};