import mongoose from 'mongoose';

const atsReportSchema = new mongoose.Schema({
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  keywordMatch: {
    score: Number,
    matchedKeywords: [String],
    missingKeywords: [String]
  },
  formatting: {
    score: Number,
    issues: [String],
    suggestions: [String]
  },
  actionVerbs: {
    score: Number,
    usedVerbs: [String],
    suggestedVerbs: [String]
  },
  skillAnalysis: {
    hardSkills: {
      score: Number,
      identified: [String]
    },
    softSkills: {
      score: Number,
      identified: [String]
    }
  },
  lengthCheck: {
    score: Number,
    currentPageCount: Number,
    recommendedPageCount: Number
  },
  weakSentences: [{
    sentence: String,
    suggestions: [String]
  }],
  fileParsingIssues: [String],
  detailedFeedback: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('AtsReport', atsReportSchema);