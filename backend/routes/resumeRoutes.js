import express from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  downloadResumePdf,
  downloadResumeOdf,
  downloadResumeDocx,
  getAllResumes
} from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.route('/')
  .get(protect, getResumes)
  .post(protect, createResume);

// Admin route to get all resumes
router.route('/admin/all')
  .get(protect, authorize('admin'), getAllResumes);

router.route('/:id')
  .get(protect, getResumeById)
  .put(protect, updateResume)
  .delete(protect, deleteResume);

router.route('/:id/duplicate')
  .post(protect, duplicateResume);

router.route('/:id/download/pdf')
  .get(protect, downloadResumePdf);

router.route('/:id/download/odf')
  .get(protect, downloadResumeOdf);

router.route('/:id/download/docx')
  .get(protect, downloadResumeDocx);

export default router;