import express from 'express';
import { createPrescription, getPrescriptions, getPrescriptionById, updatePrescriptionStatus } from '../controllers/prescriptionController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.route('/')
  .post(authorizeRoles('doctor'), createPrescription)
  .get(getPrescriptions);

router.route('/:id')
  .get(getPrescriptionById);

router.route('/:id/status')
  .patch(authorizeRoles('doctor', 'admin'), updatePrescriptionStatus);

export default router;
