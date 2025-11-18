import express from 'express';
import {
  generateAtsScore,
  getAtsReport,
  getAtsReportsByResume
} from '../controllers/atsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.route('/score')
  .post(protect, generateAtsScore);

router.route('/report/:id')
  .get(protect, getAtsReport);

router.route('/reports/resume/:resumeId')
  .get(protect, getAtsReportsByResume);

export default router;