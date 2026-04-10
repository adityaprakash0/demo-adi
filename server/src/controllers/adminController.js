import { validationResult } from 'express-validator';
import Donor from '../models/Donor.js';
import EmergencyRequest from '../models/EmergencyRequest.js';
import User from '../models/User.js';

export const getOverview = async (_req, res) => {
  try {
    const [users, donors, openRequests, totalRequests, recentRequests] = await Promise.all([
      User.countDocuments(),
      Donor.countDocuments(),
      EmergencyRequest.countDocuments({ status: 'Open' }),
      EmergencyRequest.countDocuments(),
      EmergencyRequest.find().populate('requester', 'name email phone').sort({ createdAt: -1 }).limit(5),
    ]);

    return res.json({
      stats: {
        users,
        donors,
        openRequests,
        totalRequests,
      },
      recentRequests,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch admin overview', error: error.message });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch users', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update user role', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Promise.all([
      Donor.deleteOne({ user: user._id }),
      EmergencyRequest.deleteMany({ requester: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete user', error: error.message });
  }
};

export const getDonors = async (_req, res) => {
  try {
    const donors = await Donor.find().populate('user', 'name email phone role').sort({ createdAt: -1 });
    return res.json(donors);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch donors', error: error.message });
  }
};

export const updateDonorAvailability = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { availability: req.body.availability },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone role');

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    return res.json(donor);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update donor availability', error: error.message });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    return res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete donor', error: error.message });
  }
};

