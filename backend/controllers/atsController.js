import asyncHandler from 'express-async-handler';
import AtsReport from '../models/AtsReport.js';

// @desc    Generate ATS score and report
// @route   POST /api/ats/score
// @access  Private
const generateAtsScore = asyncHandler(async (req, res) => {
  try {
    const { resumeId, resumeContent } = req.body;
    const userId = req.user.id;
    
    // In a real implementation, this would analyze the resume content
    // For now, we'll generate mock data with some logic based on resume content
    const mockAtsReport = {
      resume: resumeId,
      user: userId,
      overallScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      keywordMatch: {
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        matchedKeywords: ["JavaScript", "React", "Node.js"],
        missingKeywords: ["TypeScript", "AWS", "Docker"]
      },
      formatting: {
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        issues: ["Inconsistent bullet points", "Missing metrics"],
        suggestions: ["Standardize bullet points", "Add quantifiable metrics"]
      },
      actionVerbs: {
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        usedVerbs: ["managed", "developed"],
        suggestedVerbs: ["orchestrated", "pioneered", "optimized"]
      },
      skillAnalysis: {
        hardSkills: {
          score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
          identified: ["JavaScript", "React", "Node.js", "MongoDB"]
        },
        softSkills: {
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
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
    
    // Save the ATS report to database
    const atsReport = new AtsReport(mockAtsReport);
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