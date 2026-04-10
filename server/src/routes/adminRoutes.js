import express from 'express';
import { body } from 'express-validator';
import {
  deleteDonor,
  deleteUser,
  getDonors,
  getOverview,
  getUsers,
  updateDonorAvailability,
  updateUserRole,
} from '../controllers/adminController.js';
import admin from '../middleware/admin.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth, admin);

router.get('/overview', getOverview);
router.get('/users', getUsers);
router.patch(
  '/users/:id/role',
  [body('role').isIn(['user', 'admin']).withMessage('Select a valid role')],
  updateUserRole
);
router.delete('/users/:id', deleteUser);

router.get('/donors', getDonors);
router.patch(
  '/donors/:id/availability',
  [
    body('availability')
      .custom((value) => typeof value === 'boolean')
      .withMessage('Availability must be true or false'),
  ],
  updateDonorAvailability
);
router.delete('/donors/:id', deleteDonor);

export default router;
