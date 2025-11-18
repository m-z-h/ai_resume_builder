import express from 'express';
import {
  getDashboardData,
  getUserGrowth,
  getTemplateUsage,
  getJobTrends
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and require admin access
router.route('/dashboard')
  .get(protect, authorize('admin', 'superadmin'), getDashboardData);

router.route('/user-growth')
  .get(protect, authorize('admin', 'superadmin'), getUserGrowth);

router.route('/template-usage')
  .get(protect, authorize('admin', 'superadmin'), getTemplateUsage);

router.route('/job-trends')
  .get(protect, authorize('admin', 'superadmin'), getJobTrends);

export default router;