import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateDonor, getDonorById, getMyDonorProfile, searchDonors } from '../controllers/donorController.js';
import auth from '../middleware/auth.js';
import { bloodGroups } from '../models/Donor.js';

const router = express.Router();

router
  .route('/')
  .get(searchDonors)
  .post(
    auth,
    [
      body('bloodGroup').isIn(bloodGroups).withMessage('Select a valid blood group'),
      body('location').trim().notEmpty().withMessage('Location is required'),
      body('availability')
        .custom((value) => typeof value === 'boolean')
        .withMessage('Availability must be true or false'),
      body('phone').trim().isLength({ min: 10 }).withMessage('Phone should be at least 10 digits'),
      body('age').isInt({ min: 18, max: 65 }).withMessage('Age must be between 18 and 65'),
      body('unitsAvailable').isInt({ min: 1, max: 5 }).withMessage('Units available must be between 1 and 5'),
      body('lastDonated').optional({ values: 'falsy' }).isISO8601().withMessage('Enter a valid donation date'),
      body('about').optional().trim().isLength({ max: 500 }).withMessage('About should be under 500 characters'),
    ],
    createOrUpdateDonor
  );

router.get('/me', auth, getMyDonorProfile);
router.get('/:id', getDonorById);

export default router;
