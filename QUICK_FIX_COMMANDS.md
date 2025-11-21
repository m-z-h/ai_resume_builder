# Quick Fix Commands

## If AI Features Don't Work

### Initialize Features in Database
```bash
cd backend
npm run init-features
```

This will enable all AI features for all users.

## If Skills Still Give Errors

### Check MongoDB
```bash
# Connect to MongoDB
mongosh

# Use your database
use ai_resume_builder

# Check a resume
db.resumes.findOne()

# If skills field looks wrong, update it
db.resumes.updateMany(
  {},
  { $set: { skills: [] } }
)
```

## Restart Everything

### Backend
```bash
cd backend
# Stop current process (Ctrl+C)
npm run dev
```

### Frontend
```bash
cd frontend
# Stop current process (Ctrl+C)
npm run dev
```

## Test AI Features

### In Browser Console
```javascript
// Test if token exists
localStorage.getItem('token')

// Test API call
fetch('/api/ai/generateSummary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    personalInfo: { firstName: 'John', lastName: 'Doe' },
    experience: [],
    skills: ['JavaScript']
  })
})
.then(r => r.json())
.then(console.log)
```

## Check Environment Variables

```bash
cd backend
cat .env
```

Make sure you have:
```
GROQ_API_KEY=your_key_here
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

## Clear Browser Data

1. Open DevTools (F12)
2. Application tab
3. Clear Storage
4. Reload page
5. Login again

## Check Backend Logs

Look for these messages:
- ✅ "Server is running on port 5000"
- ✅ "MongoDB Connected"
- ❌ Any error messages

## Test Resume Creation

### Simple Test
1. Login
2. Go to Resume Builder
3. Fill Personal Info
4. Add skills: "JavaScript, React"
5. Click "Save & Next"
6. Should work without errors

### AI Test
1. Go to Summary section
2. Click "Generate with AI"
3. Should generate summary
4. No alert about "not available"

## Common Issues & Solutions

### Issue: "AI features not available"
**Solution**: Features not initialized
```bash
cd backend
npm run init-features
```

### Issue: Skills validation error
**Solution**: Already fixed in code, restart backend

### Issue: AI not generating
**Solution**: Check GROQ_API_KEY
```bash
echo $GROQ_API_KEY  # Linux/Mac
echo %GROQ_API_KEY%  # Windows CMD
$env:GROQ_API_KEY   # Windows PowerShell
```

### Issue: 401 Unauthorized
**Solution**: Login again, token expired

### Issue: 500 Server Error
**Solution**: Check backend logs for details

## Verify Fixes Applied

### Check Skills Model
```bash
cd backend
grep -A 5 "skills:" models/Resume.js
```

Should show:
```javascript
skills: {
  type: [mongoose.Schema.Types.Mixed],
  default: []
}
```

### Check AI Functions
```bash
cd frontend
grep -A 3 "generateAISummary" src/pages/user/ResumeBuilder.jsx
```

Should NOT have feature check alert at the start.

## Database Queries

### Check Features
```javascript
// In mongosh
use ai_resume_builder
db.featurecontrols.find().pretty()
```

### Check Users
```javascript
db.users.find({}, { name: 1, email: 1, role: 1 }).pretty()
```

### Check Resumes
```javascript
db.resumes.find({}, { title: 1, skills: 1 }).pretty()
```

## API Testing with cURL

### Test Summary Generation
```bash
curl -X POST http://localhost:5000/api/ai/generateSummary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "personalInfo": {"firstName": "John", "lastName": "Doe"},
    "experience": [],
    "skills": ["JavaScript"]
  }'
```

### Test Resume Creation
```bash
curl -X POST http://localhost:5000/api/resumes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Resume",
    "personalInfo": {"firstName": "John", "lastName": "Doe"},
    "skills": ["JavaScript", "React"]
  }'
```

## Emergency Reset

### Reset Everything
```bash
# Stop all processes
# Ctrl+C in both terminals

# Backend
cd backend
rm -rf node_modules
npm install
npm run init-features
npm run dev

# Frontend (new terminal)
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Reset Database (CAUTION!)
```javascript
// In mongosh - THIS DELETES ALL DATA!
use ai_resume_builder
db.dropDatabase()

// Then restart backend and run:
npm run init-features
```

## Success Indicators

✅ Backend starts without errors
✅ Frontend connects to backend
✅ Can login successfully
✅ Can create resume
✅ Can add skills
✅ Can click "Save & Next"
✅ Can click "Generate with AI"
✅ AI generates content
✅ No validation errors
✅ No false alerts

## Still Having Issues?

1. Check all environment variables
2. Verify MongoDB is running
3. Check GROQ_API_KEY is valid
4. Clear browser cache completely
5. Try different browser
6. Check firewall/antivirus
7. Review backend console logs
8. Review browser console logs

## Get Help

Include this info when asking for help:
- Error message (exact text)
- Backend console output
- Browser console output
- Steps to reproduce
- What you've tried already

---

**Most Common Fix**: Just run `npm run init-features` in backend folder!
