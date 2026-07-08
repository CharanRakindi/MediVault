import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getAuditLogs);

export default router;
