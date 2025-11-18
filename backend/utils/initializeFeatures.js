import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FeatureControl from '../models/FeatureControl.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
await connectDB();

const defaultFeatures = [
  {
    featureName: 'aiResumeGenerator',
    isEnabled: true,
    allowedRoles: ['user', 'admin', 'superadmin'],
    dailyLimit: 5
  },
  {
    featureName: 'aiSectionImprover',
    isEnabled: true,
    allowedRoles: ['user', 'admin', 'superadmin'],
    dailyLimit: 20
  },
  {
    featureName: 'atsScoreChecker',
    isEnabled: true,
    allowedRoles: ['user', 'admin', 'superadmin'],
    dailyLimit: 10
  },
  {
    featureName: 'templateUsage',
    isEnabled: true,
    allowedRoles: ['user', 'admin', 'superadmin'],
    dailyLimit: 0 // No limit
  },
  {
    featureName: 'pdfDownload',
    isEnabled: true,
    allowedRoles: ['user', 'admin', 'superadmin'],
    dailyLimit: 0 // No limit
  },
  {
    featureName: 'odfDownload',
    isEnabled: true,
    allowedRoles: ['user', 'admin', 'superadmin'],
    dailyLimit: 0 // No limit
  },
  {
    featureName: 'docxDownload',
    isEnabled: true,
    allowedRoles: ['user', 'admin', 'superadmin'],
    dailyLimit: 0 // No limit
  },
  {
    featureName: 'roleSpecificTools',
    isEnabled: true,
    allowedRoles: ['user', 'admin', 'superadmin', 'fresher', 'experienced', 'tech', 'non-tech', 'student'],
    dailyLimit: 0 // No limit
  }
];

const initializeFeatures = async () => {
  try {
    // Delete existing features
    await FeatureControl.deleteMany({});
    
    // Insert default features
    await FeatureControl.insertMany(defaultFeatures);
    
    console.log('Default features initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing features:', error);
    process.exit(1);
  }
};

await initializeFeatures();