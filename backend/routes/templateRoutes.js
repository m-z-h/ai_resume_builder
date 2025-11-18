import express from 'express';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplatesByCategory,
  incrementTemplateUsage
} from '../controllers/templateController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getTemplates);

router.route('/:id')
  .get(getTemplateById);

router.route('/category/:category')
  .get(getTemplatesByCategory);

// Protected routes
router.route('/:id/use')
  .post(protect, incrementTemplateUsage);

// Protected admin routes
router.route('/')
  .post(protect, authorize('admin', 'superadmin'), createTemplate);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateTemplate)
  .delete(protect, authorize('admin', 'superadmin'), deleteTemplate);

export default router;