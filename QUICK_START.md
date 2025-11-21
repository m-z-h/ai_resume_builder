# Quick Start Guide - Step-by-Step Resume Builder

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenRouter API key (for AI features)

## Installation

### 1. Clone and Setup
```bash
# Navigate to project directory
cd ai_resume_builder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create `backend/.env` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai_resume_builder
# or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_resume_builder

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=5000
NODE_ENV=development

# AI API (OpenRouter)
GROQ_API_KEY=your_openrouter_api_key_here
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Testing the New Features

### 1. Create an Account
1. Navigate to http://localhost:5173
2. Click "Register"
3. Create a new account
4. Log in

### 2. Access Step-by-Step Builder
1. From Dashboard, click "Step-by-Step Builder" card
2. You'll see the 8-step progress bar

### 3. Test Each Section

**Personal Details:**
- Fill in name, email, phone
- Click "Save & Next"

**Summary:**
- Click "Generate with AI" button
- Wait for AI to generate summary
- Edit if needed
- Click "Save & Next"

**Experience:**
- Click "+ Add Experience"
- Fill in job title and company
- Click "Generate Description"
- Review AI-generated bullet points
- Click "Save & Next"

**Education:**
- Click "+ Add Education"
- Fill in degree and institution
- Click "Save & Next"

**Skills:**
- Enter skills separated by commas
- See them appear as tags
- Click "Save & Next"

**Projects:**
- Click "+ Add Project"
- Fill in project name and technologies
- Click "Generate Description"
- Review AI-generated description
- Click "Save & Next"

**Certifications:**
- Optional section
- Add if you have certifications
- Click "Save & Next"

**Preview & Design:**
- Customize font, colors, layout
- See real-time preview
- Download PDF or Word

## API Testing

### Using Postman or cURL

**1. Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Generate Summary (use token from login):**
```bash
curl -X POST http://localhost:5000/api/ai/generateSummary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "experience": [],
    "skills": ["JavaScript", "React"]
  }'
```

**4. Generate Experience Description:**
```bash
curl -X POST http://localhost:5000/api/ai/generateExperienceDescription \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "jobTitle": "Software Engineer",
    "company": "Tech Corp",
    "responsibilities": "Developed web applications"
  }'
```

**5. Generate Project Description:**
```bash
curl -X POST http://localhost:5000/api/ai/generateProjectDescription \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "projectTitle": "E-commerce Platform",
    "technologies": "React, Node.js, MongoDB",
    "projectPurpose": "Online shopping platform"
  }'
```

## Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is running
# For local MongoDB:
mongod

# Check if port 5000 is available
netstat -ano | findstr :5000

# Check environment variables
cat backend/.env
```

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules
npm install

# Check if port 5173 is available
netstat -ano | findstr :5173
```

### AI Generation Not Working
1. Check GROQ_API_KEY in .env
2. Verify API key is valid
3. Check backend console for errors
4. Test API key with curl:
```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Database Connection Issues
```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017/ai_resume_builder

# Or for Atlas:
mongosh "mongodb+srv://cluster.mongodb.net/ai_resume_builder" --username YOUR_USERNAME
```

### CORS Errors
- Ensure backend is running on port 5000
- Check CORS configuration in backend/server.js
- Verify frontend is accessing correct backend URL

## Development Tips

### Hot Reload
- Frontend: Vite provides instant hot reload
- Backend: nodemon restarts on file changes

### Debugging
```javascript
// Add console logs in components
console.log('Resume Data:', resumeData);

// Check Redux state
console.log('Redux State:', store.getState());

// Backend debugging
console.log('Request Body:', req.body);
console.log('User:', req.user);
```

### Database Inspection
```bash
# Connect to MongoDB
mongosh

# Use database
use ai_resume_builder

# View resumes
db.resumes.find().pretty()

# View users
db.users.find().pretty()

# Clear test data
db.resumes.deleteMany({})
```

## Common Commands

### Backend
```bash
# Start development server
npm run dev

# Start production server
npm start

# Initialize features
npm run init-features

# Initialize templates
npm run init-templates
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## File Structure Reference

```
ai_resume_builder/
├── backend/
│   ├── controllers/
│   │   ├── aiController.js (AI generation logic)
│   │   └── resumeController.js (Resume CRUD)
│   ├── models/
│   │   └── Resume.js (Updated schema)
│   ├── routes/
│   │   └── aiRoutes.js (AI endpoints)
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AIGenerateButton.jsx (New)
│   │   ├── pages/
│   │   │   └── user/
│   │   │       ├── StepResumeBuilder.jsx (New)
│   │   │       └── sections/ (New)
│   │   │           ├── PersonalInfoSection.jsx
│   │   │           ├── SummarySection.jsx
│   │   │           ├── ExperienceSection.jsx
│   │   │           ├── EducationSection.jsx
│   │   │           ├── SkillsSection.jsx
│   │   │           ├── ProjectsSection.jsx
│   │   │           ├── CertificationsSection.jsx
│   │   │           └── PreviewSection.jsx
│   │   └── App.jsx (Updated routes)
│   └── package.json
└── Documentation/
    ├── STEP_BY_STEP_RESUME_BUILDER.md
    ├── USER_GUIDE.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── QUICK_START.md (this file)
```

## Next Steps

1. **Test All Features**: Go through each section
2. **Check AI Generation**: Test all AI endpoints
3. **Test Downloads**: Verify PDF and Word downloads
4. **Review Code**: Understand the implementation
5. **Customize**: Modify as needed for your use case

## Getting Help

### Resources
- Technical Documentation: STEP_BY_STEP_RESUME_BUILDER.md
- User Guide: USER_GUIDE.md
- Implementation Details: IMPLEMENTATION_SUMMARY.md

### Support
- Check console for errors
- Review backend logs
- Test API endpoints individually
- Verify environment variables

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
GROQ_API_KEY=your_production_api_key
PORT=5000
```

### Deploy Backend
```bash
cd backend
npm start
```

### Serve Frontend
Use a static file server or deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Your own server with nginx

---

**Happy Coding!** 🚀

For questions or issues, refer to the documentation or contact the development team.
