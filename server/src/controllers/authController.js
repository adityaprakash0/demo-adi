import { validationResult } from 'express-validator';
import Donor from '../models/Donor.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { track } from '../utils/pulseiq.js';

const buildAuthResponse = async (user) => {
  const donorProfile = await Donor.findOne({ user: user._id });

  return {
    token: generateToken(user._id),
    user,
    donorProfile,
  };
};

export const signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    void track('user_registered', user._id.toString(), { email: user.email, role: user.role });

    return res.status(201).json(await buildAuthResponse(user));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create account', error: error.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    void track('user_logged_in', user._id.toString(), { email: user.email, role: user.role });

    return res.json(await buildAuthResponse(user));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to login', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const donorProfile = await Donor.findOne({ user: req.user._id });

    return res.json({
      user: req.user,
      donorProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch profile', error: error.message });
  }
};
