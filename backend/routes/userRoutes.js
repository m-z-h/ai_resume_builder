import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and require admin access
router.route('/')
  .get(protect, authorize('admin', 'superadmin'), getUsers);

router.route('/:id')
  .get(protect, authorize('admin', 'superadmin'), getUserById)
  .put(protect, authorize('admin', 'superadmin'), updateUser)
  .delete(protect, authorize('admin', 'superadmin'), deleteUser);

router.route('/:id/block')
  .put(protect, authorize('admin', 'superadmin'), blockUser);

export default router;