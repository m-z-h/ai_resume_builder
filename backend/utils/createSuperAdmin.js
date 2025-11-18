import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
await connectDB();

const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('Super admin already exists:');
      console.log(`Email: ${existingSuperAdmin.email}`);
      console.log(`Name: ${existingSuperAdmin.name}`);
      process.exit(0);
    }
    
    // Create super admin user
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@airesumebuilder.com',
      password: 'Admin@123',
      role: 'superadmin',
      isActive: true
    });
    
    console.log('Super admin created successfully!');
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Password: Admin@123`);
    console.log('Please change the password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

await createSuperAdmin();