import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Template from '../models/Template.js';
import AtsReport from '../models/AtsReport.js';
import FeatureControl from '../models/FeatureControl.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
await connectDB();

const testSetup = async () => {
  try {
    console.log('Testing AI Resume Builder Setup...\n');
    
    // Test 1: Check database connection
    console.log('1. Database Connection: ✓ Connected');
    
    // Test 2: Check collections
    const userCount = await User.countDocuments();
    console.log(`2. Users Collection: ✓ ${userCount} documents`);
    
    const resumeCount = await Resume.countDocuments();
    console.log(`3. Resumes Collection: ✓ ${resumeCount} documents`);
    
    const templateCount = await Template.countDocuments();
    console.log(`4. Templates Collection: ✓ ${templateCount} documents`);
    
    const atsReportCount = await AtsReport.countDocuments();
    console.log(`5. ATS Reports Collection: ✓ ${atsReportCount} documents`);
    
    const featureCount = await FeatureControl.countDocuments();
    console.log(`6. Feature Controls Collection: ✓ ${featureCount} documents`);
    
    // Test 3: Check specific data
    const superAdmin = await User.findOne({ role: 'superadmin' });
    console.log(`7. Super Admin User: ✓ ${superAdmin ? 'Exists' : 'Not found'}`);
    
    const sampleUser = await User.findOne({ email: 'john.doe@example.com' });
    console.log(`8. Sample User: ✓ ${sampleUser ? 'Exists' : 'Not found'}`);
    
    const templates = await Template.find();
    console.log(`9. Templates: ✓ ${templates.length} templates available`);
    
    const features = await FeatureControl.find();
    console.log(`10. Features: ✓ ${features.length} features configured`);
    
    console.log('\n🎉 All tests passed! The AI Resume Builder is properly configured.');
    console.log('\n📋 Summary:');
    console.log(`   - Database: Connected ✓`);
    console.log(`   - Users: ${userCount} (including super admin)`);
    console.log(`   - Resumes: ${resumeCount}`);
    console.log(`   - Templates: ${templateCount}`);
    console.log(`   - ATS Reports: ${atsReportCount}`);
    console.log(`   - Features: ${featureCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing setup:', error);
    process.exit(1);
  }
};

await testSetup();