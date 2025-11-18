import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import AtsReport from '../models/AtsReport.js';
import Template from '../models/Template.js';

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardData = asyncHandler(async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalAtsChecks = await AtsReport.countDocuments();
    
    // Get AI usage (resumes with AI-generated content)
    const totalAiUsage = await Resume.countDocuments({
      $or: [
        { 'personalInfo.summary': { $exists: true, $ne: '' } },
        { 'experience.achievements': { $exists: true, $ne: [] } }
      ]
    });
    
    // Get monthly user growth (last 6 months)
    const monthlyUsers = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const users = await User.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });
      
      monthlyUsers.push({
        month: start.toLocaleString('default', { month: 'short' }),
        users
      });
    }
    
    // Get popular templates
    const popularTemplates = await Template.find({})
      .sort({ usedByCount: -1 })
      .limit(5)
      .select('name usedByCount');
      
    const popularTemplatesFormatted = popularTemplates.map(template => ({
      name: template.name,
      usage: template.usedByCount
    }));
    
    // Get job role trends (based on resume titles)
    const jobRoleTrends = await Resume.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: "$title", regex: /software|developer|engineer/i } },
              "Software Engineer",
              {
                $cond: [
                  { $regexMatch: { input: "$title", regex: /marketing|manager/i } },
                  "Marketing Manager",
                  {
                    $cond: [
                      { $regexMatch: { input: "$title", regex: /data|analyst/i } },
                      "Data Analyst",
                      {
                        $cond: [
                          { $regexMatch: { input: "$title", regex: /product/i } },
                          "Product Manager",
                          {
                            $cond: [
                              { $regexMatch: { input: "$title", regex: /design|ux|ui/i } },
                              "UX Designer",
                              "Other"
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const jobRoleTrendsFormatted = jobRoleTrends.map(role => ({
      role: role._id,
      count: role.count
    }));
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalResumes,
        totalAtsChecks,
        totalAiUsage,
        monthlyUsers,
        popularTemplates: popularTemplatesFormatted,
        jobRoleTrends: jobRoleTrendsFormatted
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
});

// @desc    Get user growth data
// @route   GET /api/analytics/user-growth
// @access  Private/Admin
const getUserGrowth = asyncHandler(async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const monthlyUsers = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const users = await User.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });
      
      monthlyUsers.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        users
      });
    }
    
    res.json({
      success: true,
      data: monthlyUsers
    });
  } catch (error) {
    console.error('User Growth Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user growth data',
      error: error.message
    });
  }
});

// @desc    Get template usage data
// @route   GET /api/analytics/template-usage
// @access  Private/Admin
const getTemplateUsage = asyncHandler(async (req, res) => {
  try {
    const templates = await Template.find({})
      .sort({ usedByCount: -1 })
      .select('name usedByCount category');
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Template Usage Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template usage data',
      error: error.message
    });
  }
});

// @desc    Get job role trends
// @route   GET /api/analytics/job-trends
// @access  Private/Admin
const getJobTrends = asyncHandler(async (req, res) => {
  try {
    const jobRoleTrends = await Resume.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: "$title", regex: /software|developer|engineer/i } },
              "Software Engineer",
              {
                $cond: [
                  { $regexMatch: { input: "$title", regex: /marketing|manager/i } },
                  "Marketing Manager",
                  {
                    $cond: [
                      { $regexMatch: { input: "$title", regex: /data|analyst/i } },
                      "Data Analyst",
                      {
                        $cond: [
                          { $regexMatch: { input: "$title", regex: /product/i } },
                          "Product Manager",
                          {
                            $cond: [
                              { $regexMatch: { input: "$title", regex: /design|ux|ui/i } },
                              "UX Designer",
                              "Other"
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const formattedTrends = jobRoleTrends.map(role => ({
      role: role._id,
      count: role.count
    }));
    
    res.json({
      success: true,
      data: formattedTrends
    });
  } catch (error) {
    console.error('Job Trends Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job trends data',
      error: error.message
    });
  }
});

export {
  getDashboardData,
  getUserGrowth,
  getTemplateUsage,
  getJobTrends
};