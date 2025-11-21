import express from 'express';
import {
  generateResumeContent,
  improveSection,
  generateAtsScore,
  rewriteForJobDescription,
  extractKeywords,
  generateSummary,
  generateExperienceDescription,
  generateProjectDescription
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.route('/generate')
  .post(protect, generateResumeContent);

router.route('/improveSection')
  .post(protect, improveSection);

router.route('/atsScore')
  .post(protect, generateAtsScore);

router.route('/rewriteJobSpecific')
  .post(protect, rewriteForJobDescription);

router.route('/keywordExtract')
  .post(protect, extractKeywords);

router.route('/generateSummary')
  .post(protect, generateSummary);

router.route('/generateExperienceDescription')
  .post(protect, generateExperienceDescription);

router.route('/generateProjectDescription')
  .post(protect, generateProjectDescription);

export default router;