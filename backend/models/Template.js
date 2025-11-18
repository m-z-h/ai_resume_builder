import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a template name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    enum: ['General', 'Business', 'Creative', 'Technical', 'Student'],
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true
  }],
  thumbnail: {
    type: String // URL to template thumbnail image
  },
  htmlStructure: {
    type: String,
    required: [true, 'Please provide HTML structure']
  },
  cssStyles: {
    type: String // Custom CSS for the template
  },
  isAtsFriendly: {
    type: Boolean,
    default: true
  },
  isFree: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  customizableOptions: {
    fonts: [{
      name: String,
      value: String
    }],
    colors: {
      primary: String,
      secondary: String,
      accent: String
    },
    spacing: {
      sectionPadding: String,
      lineHeight: String
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  allowedRoles: [{
    type: String,
    enum: ['user', 'admin', 'superadmin', 'fresher', 'experienced', 'tech', 'non-tech', 'student']
  }],
  usedByCount: {
    type: Number,
    default: 0
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

export default mongoose.model('Template', templateSchema);