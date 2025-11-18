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
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  }],
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