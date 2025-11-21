# Comprehensive Testing Guide - AI Resume Builder

## Pre-Testing Setup

### 1. Environment Setup
```bash
# Ensure MongoDB is running
mongod

# Backend setup
cd backend
npm install
# Create .env file with required variables
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### 2. Required Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/ai_resume_builder
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
PORT=5000
NODE_ENV=development
```

## Testing Scenarios

### A. Authentication Testing

#### Test 1: User Registration
1. Navigate to http://localhost:5173/register
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Register"
4. **Expected**: Redirect to user dashboard
5. **Verify**: User appears in database

#### Test 2: User Login
1. Navigate to http://localhost:5173/login
2. Enter credentials from Test 1
3. Click "Login"
4. **Expected**: Redirect to user dashboard
5. **Verify**: Token stored in localStorage

#### Test 3: Admin Login
1. Create admin user manually in database:
```javascript
// In MongoDB shell
use ai_resume_builder
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // Use bcrypt to hash "admin123"
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```
2. Navigate to http://localhost:5173/admin/login
3. Enter admin credentials
4. **Expected**: Redirect to admin dashboard

#### Test 4: Logout
1. While logged in, click "Logout"
2. **Expected**: Redirect to home page
3. **Verify**: Token removed from localStorage
4. **Verify**: Cannot access protected routes

### B. Resume Builder Testing (Existing)

#### Test 5: Create Basic Resume
1. Login as user
2. Click "Create Resume" from dashboard
3. Fill in Personal Info:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john@example.com"
   - Phone: "123-456-7890"
4. Add Summary: "Experienced software engineer..."
5. Add Experience:
   - Title: "Software Engineer"
   - Company: "Tech Corp"
   - Start Date: "2020-01"
   - End Date: "2023-12"
   - Description: "Developed web applications"
6. Add Education:
   - Degree: "Bachelor of Science"
   - School: "University"
   - Location: "City, State"
   - Start Date: "2016-09"
   - End Date: "2020-05"
7. Add Skills: "JavaScript, React, Node.js"
8. Click "Save Resume"
9. **Expected**: Resume saved successfully
10. **Verify**: Resume appears in dashboard

#### Test 6: Edit Existing Resume
1. From dashboard, click on a resume
2. Modify any field
3. Click "Save Resume"
4. **Expected**: Changes saved
5. **Verify**: Changes persist after refresh

### C. Step-by-Step Builder Testing (New)

#### Test 7: Create Resume Step-by-Step
1. Login as user
2. Click "Step-by-Step Builder" from dashboard
3. **Step 1 - Personal Details**:
   - Fill al