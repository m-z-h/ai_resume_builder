import mongoose from 'mongoose';

const featureControlSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'aiResumeGenerator',
      'aiSectionImprover',
      'atsScoreChecker',
      'templateUsage',
      'pdfDownload',
      'odfDownload',
      'docxDownload',
      'roleSpecificTools'
    ]
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  allowedRoles: [{
    type: String,
    enum: ['user', 'admin', 'superadmin', 'fresher', 'experienced', 'tech', 'non-tech', 'student']
  }],
  dailyLimit: {
    type: Number,
    default: 0 // 0 means no limit
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('FeatureControl', featureControlSchema);