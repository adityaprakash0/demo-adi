import express from 'express';
import { body } from 'express-validator';
import { getCurrentUser, login, signup } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phone')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 10 })
      .withMessage('Phone should be at least 10 digits'),
  ],
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', auth, getCurrentUser);

export default router;
