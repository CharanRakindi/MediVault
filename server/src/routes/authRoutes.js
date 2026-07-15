import express from 'express';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  updatePassword,
  updateProfile,
  activateAccount,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  updateProfileSchema,
  activateSchema,
} from '../validators/authValidators.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Only failed attempts count — wrong password while demo-seeding should not lock you out forever.
// Override with AUTH_RATE_LIMIT_MAX on the server if needed.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:
    process.env.NODE_ENV === 'test'
      ? 1000
      : Number(process.env.AUTH_RATE_LIMIT_MAX) || 30,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Wait a few minutes, or restart the API container to clear the limit.',
  },
});

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/activate', authLimiter, validateRequest(activateSchema), activateAccount);
router.post('/logout', authenticate, logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, validateRequest(updateProfileSchema), updateProfile);
router.patch('/update-password', authenticate, validateRequest(updatePasswordSchema), updatePassword);

export default router;
