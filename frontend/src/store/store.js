import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import resumeSlice from './resumeSlice';
import templateSlice from './templateSlice';
import featureSlice from './featureSlice';
import analyticsSlice from './analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    resumes: resumeSlice,
    templates: templateSlice,
    features: featureSlice,
    analytics: analyticsSlice,
  },
});