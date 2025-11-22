import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a resume title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    website: String,
    summary: String
  },
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean,
    description: String,
    achievements: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  skills: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expirationDate: Date,
    credentialId: String,
    url: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    startDate: Date,
    endDate: Date
  }],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Basic', 'Conversational', 'Fluent', 'Native']
    }
  }],
  customSections: [{
    title: String,
    content: String
  }],
  atsScore: {
    type: Number,
    min: 0,
    max: 100
  },
  atsReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AtsReport'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  // Section-wise completion tracking
  sectionsCompleted: {
    templateSelection: { type: Boolean, default: false },
    personalInfo: { type: Boolean, default: false },
    summary: { type: Boolean, default: false },
    experience: { type: Boolean, default: false },
    education: { type: Boolean, default: false },
    skills: { type: Boolean, default: false },
    projects: { type: Boolean, default: false },
    certifications: { type: Boolean, default: false },
    additionalInfo: { type: Boolean, default: false },
    preview: { type: Boolean, default: false }
  },
  // Design customization
  designSettings: {
    template: { type: String, default: 'modern' },
    fontFamily: { type: String, default: 'Inter, sans-serif' },
    fontSize: { type: String, default: '16px' },
    colorTheme: { type: String, default: 'blue' },
    layout: { type: String, default: 'single-column' }
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

export default mongoose.model('Resume', resumeSchema);