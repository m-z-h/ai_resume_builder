import express from 'express';
import {
  submitContactForm,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.route('/')
  .post(submitContactForm);

// Admin routes
router.route('/')
  .get(protect, authorize('admin', 'superadmin'), getContactMessages);

router.route('/:id')
  .get(protect, authorize('admin', 'superadmin'), getContactMessageById)
  .put(protect, authorize('admin', 'superadmin'), updateContactMessage)
  .delete(protect, authorize('admin', 'superadmin'), deleteContactMessage);

export default router;