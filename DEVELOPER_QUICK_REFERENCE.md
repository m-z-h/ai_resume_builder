# Section-Wise Resume Builder - Developer Quick Reference

## 🚀 Quick Start

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

## 📁 Key Files

### Frontend
```
frontend/src/
├── pages/user/
│   ├── StepResumeBuilder.jsx          # Main builder component
│   └── sections/
│       ├── TemplateSelectionSection.jsx
│       ├── PersonalInfoSection.jsx
│       ├── SummarySection.jsx
│       ├── ExperienceSection.jsx
│       ├── EducationSection.jsx
│       ├── SkillsSection.jsx
│       ├── ProjectsSection.jsx
│       ├── CertificationsSection.jsx
│       ├── AdditionalInfoSection.jsx
│       └── PreviewSection.jsx
└── store/
    ├── resumeSlice.js                 # Resume state management
    └── templateSlice.js               # Template state management
```

### Backend
```
backend/
├── models/
│   └── Resume.js                      # Resume schema
├── controllers/
│   └── resumeController.js            # Resume CRUD operations
└── routes/
    └── resumeRoutes.js                # Resume API routes
```

## 🔧 Component Structure

### StepResumeBuilder.jsx
```javascript
// Main state
const [currentStep, setCurrentStep] = useState(0);
const [resumeData, setResumeData] = useState({...});

// Steps array
const steps = [
  { id: 'templateSelection', title: 'Choose Template', component: TemplateSelectionSection },
  { id: 'personalInfo', title: 'Personal Details', component: PersonalInfoSection },
  // ... more steps
];

// Key functions
const saveSection = async (sectionName) => {...}
const handleSaveSection = async () => {...}
const handleNext = async () => {...}
const handlePrevious = () => {...}
```

### Section Component Template
```javascript
const SectionName = ({ resumeData, setResumeData }) => {
  const handleChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      sectionName: { ...prev.sectionName, [field]: value }
    }));
  };

  return (
    <div>
      <h2>Section Title</h2>
      {/* Form fields */}
    </div>
  );
};

export default SectionName;
```

## 🗄️ Database Schema

### Resume Model
```javascript
{
  userId: ObjectId,
  title: String,
  templateId: ObjectId,
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    website: String
  },
  summary: String,
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
  skills: [Mixed],
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
  customSections: [{
    title: String,
    content: String
  }],
  sectionsCompleted: {
    templateSelection: Boolean,
    personalInfo: Boolean,
    summary: Boolean,
    experience: Boolean,
    education: Boolean,
    skills: Boolean,
    projects: Boolean,
    certifications: Boolean,
    additionalInfo: Boolean,
    preview: Boolean
  },
  designSettings: {
    template: String,
    fontFamily: String,
    fontSize: String,
    colorTheme: String,
    layout: String
  }
}
```

## 🔌 API Endpoints

### Resume Routes
```javascript
// Get all resumes for user
GET /api/resumes
Headers: { Authorization: 'Bearer <token>' }

// Get resume by ID
GET /api/resumes/:id
Headers: { Authorization: 'Bearer <token>' }

// Create new resume
POST /api/resumes
Headers: { Authorization: 'Bearer <token>' }
Body: { title, personalInfo, experience, ... }

// Update resume
PUT /api/resumes/:id
Headers: { Authorization: 'Bearer <token>' }
Body: { title, personalInfo, experience, ... }

// Delete resume
DELETE /api/resumes/:id
Headers: { Authorization: 'Bearer <token>' }

// Download resume
GET /api/resumes/:id/download/pdf
GET /api/resumes/:id/download/docx
GET /api/resumes/:id/download/odf
Headers: { Authorization: 'Bearer <token>' }
```

## 🎨 Styling Classes

### Button Styles
```javascript
// Previous button
"px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"

// Save button
"px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800"

// Next button
"px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800"

// Finalize button
"px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800"
```

### Progress Indicator
```javascript
// Completed section
"bg-green-500 text-white shadow-lg"

// Current section
"bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-200"

// Incomplete section
"bg-gray-200 text-gray-600"
```

## 🔄 State Management

### Redux Actions
```javascript
// Resume actions
import { 
  fetchResumeById, 
  createResume, 
  updateResume, 
  setCurrentResume 
} from '../../store/resumeSlice';

// Template actions
import { 
  fetchTemplates, 
  fetchTemplateById 
} from '../../store/templateSlice';

// Usage
dispatch(fetchResumeById(id));
dispatch(createResume(resumeData));
dispatch(updateResume({ id, resumeData }));
dispatch(fetchTemplates());
```

### Local State Updates
```javascript
// Update single field
setResumeData(prev => ({
  ...prev,
  fieldName: value
}));

// Update nested object
setResumeData(prev => ({
  ...prev,
  personalInfo: {
    ...prev.personalInfo,
    [field]: value
  }
}));

// Update array
setResumeData(prev => ({
  ...prev,
  experience: [...prev.experience, newItem]
}));
```

## 🧪 Testing Commands

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run linter
npm run lint

# Check types
npm run type-check
```

## 🐛 Common Issues & Solutions

### Issue: Section not saving
```javascript
// Check: Is the section ID in sectionsCompleted?
sectionsCompleted: {
  yourSectionId: Boolean  // Must exist
}

// Check: Is saveSection being called?
const handleSaveSection = async () => {
  const currentStepData = steps[currentStep];
  await saveSection(currentStepData.id);
};
```

### Issue: Data not persisting
```javascript
// Check: Is resume ID being set?
useEffect(() => {
  if (id) {
    dispatch(fetchResumeById(id));
  }
}, [id, dispatch]);

// Check: Is URL updating after first save?
navigate(`/resume/step-builder/${result._id}`, { replace: true });
```

### Issue: Progress indicator not updating
```javascript
// Check: Is sectionsCompleted being updated?
const updatedData = { 
  ...resumeData, 
  sectionsCompleted: { 
    ...resumeData.sectionsCompleted, 
    [sectionName]: true 
  } 
};
setResumeData(updatedData);
```

## 📊 Performance Tips

### Optimize Re-renders
```javascript
// Use React.memo for section components
export default React.memo(SectionComponent);

// Use useMemo for expensive calculations
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);

// Use useCallback for functions passed as props
const handleChange = useCallback((field, value) => {
  setResumeData(prev => ({...prev, [field]: value}));
}, []);
```

### Debounce Auto-save
```javascript
const saveTimerRef = useRef(null);

useEffect(() => {
  if (saveTimerRef.current) {
    clearTimeout(saveTimerRef.current);
  }
  
  saveTimerRef.current = setTimeout(() => {
    saveResume();
  }, 2000);
  
  return () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
  };
}, [resumeData]);
```

## 🔐 Security Considerations

### Authentication
```javascript
// Always check for token
const token = localStorage.getItem('token');
if (!token) {
  navigate('/login');
  return;
}

// Include token in API calls
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};
```

### Data Validation
```javascript
// Frontend validation
if (!resumeData.personalInfo.email) {
  toast.error('Email is required');
  return;
}

// Backend validation
if (!req.body.title || req.body.title.trim() === '') {
  res.status(400);
  throw new Error('Title is required');
}
```

## 📱 Responsive Design

### Breakpoints
```javascript
// Tailwind breakpoints
sm: '640px'   // Small devices
md: '768px'   // Medium devices
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X large devices

// Usage
className="hidden lg:block"  // Hide on mobile, show on desktop
className="grid grid-cols-1 md:grid-cols-2"  // 1 col mobile, 2 cols tablet+
```

## 🎯 Adding a New Section

### Step 1: Create Section Component
```javascript
// frontend/src/pages/user/sections/NewSection.jsx
import React from 'react';

const NewSection = ({ resumeData, setResumeData }) => {
  const handleChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      newSection: { ...prev.newSection, [field]: value }
    }));
  };

  return (
    <div>
      <h2>New Section Title</h2>
      {/* Add form fields */}
    </div>
  );
};

export default NewSection;
```

### Step 2: Add to Steps Array
```javascript
// StepResumeBuilder.jsx
import NewSection from './sections/NewSection';

const steps = [
  // ... existing steps
  { id: 'newSection', title: 'New Section', component: NewSection },
];
```

### Step 3: Update Initial State
```javascript
const [resumeData, setResumeData] = useState({
  // ... existing fields
  newSection: {},
  sectionsCompleted: {
    // ... existing sections
    newSection: false
  }
});
```

### Step 4: Update Backend Model
```javascript
// backend/models/Resume.js
const resumeSchema = new mongoose.Schema({
  // ... existing fields
  newSection: {
    field1: String,
    field2: String
  },
  sectionsCompleted: {
    // ... existing sections
    newSection: { type: Boolean, default: false }
  }
});
```

## 🔍 Debugging Tips

### Enable Redux DevTools
```javascript
// Check Redux state
window.__REDUX_DEVTOOLS_EXTENSION__?.()

// Log state changes
console.log('Current state:', store.getState());
```

### Debug API Calls
```javascript
// Add interceptor
axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});
```

### Debug Component Renders
```javascript
useEffect(() => {
  console.log('Component rendered', { currentStep, resumeData });
});
```

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [React Toastify](https://fkhadra.github.io/react-toastify)

## 🆘 Getting Help

1. Check console for errors
2. Review Redux state in DevTools
3. Check network tab for API calls
4. Review documentation files
5. Check GitHub issues
6. Contact team lead

---

**Last Updated**: November 22, 2025
**Version**: 1.0.0
