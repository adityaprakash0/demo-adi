import express from 'express';
import { body } from 'express-validator';
import {
  createEmergencyRequest,
  getMyRequests,
  getOpenRequests,
  updateEmergencyRequestStatus,
} from '../controllers/requestController.js';
import admin from '../middleware/admin.js';
import auth from '../middleware/auth.js';
import { bloodGroups } from '../models/Donor.js';

const router = express.Router();

router.get('/open', getOpenRequests);
router.get('/my', auth, getMyRequests);
router.post(
  '/',
  auth,
  [
    body('patientName').trim().notEmpty().withMessage('Patient name is required'),
    body('bloodGroup').isIn(bloodGroups).withMessage('Select a valid blood group'),
    body('hospitalName').trim().notEmpty().withMessage('Hospital name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('unitsNeeded').isInt({ min: 1, max: 10 }).withMessage('Units needed must be between 1 and 10'),
    body('urgency').isIn(['Normal', 'Urgent', 'Critical']).withMessage('Select a valid urgency'),
    body('contactNumber').trim().isLength({ min: 10 }).withMessage('Contact number should be at least 10 digits'),
    body('requiredBy').optional({ values: 'falsy' }).isISO8601().withMessage('Enter a valid required by date'),
    body('message').optional().trim().isLength({ max: 500 }).withMessage('Message should be under 500 characters'),
  ],
  createEmergencyRequest
);

router.patch(
  '/:id/status',
  auth,
  admin,
  [
    body('status').isIn(['Open', 'Matched', 'Closed']).withMessage('Select a valid status'),
  ],
  updateEmergencyRequestStatus
);

export default router;

