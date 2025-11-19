import express from 'express';
import {
  getFeatures,
  getFeatureByName,
  createFeature,
  updateFeature,
  deleteFeature,
  checkFeature,
  checkMultipleFeatures
} from '../controllers/featureController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.route('/')
  .get(protect, authorize('admin', 'superadmin'), getFeatures)
  .post(protect, authorize('admin', 'superadmin'), createFeature);

router.route('/:name')
  .get(protect, authorize('admin', 'superadmin'), getFeatureByName)
  .put(protect, authorize('admin', 'superadmin'), updateFeature)
  .delete(protect, authorize('admin', 'superadmin'), deleteFeature);

// User route to check feature availability
router.route('/check/:name')
  .get(protect, checkFeature);

// User route to check multiple features at once
router.route('/check')
  .post(protect, checkMultipleFeatures);

export default router;