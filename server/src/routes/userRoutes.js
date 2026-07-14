import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUser,
  createUser,
} from '../controllers/userController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .patch(updateUser);

router.route('/:id/status')
  .patch(updateUserStatus);

export default router;
