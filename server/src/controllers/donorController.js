import { validationResult } from 'express-validator';
import Donor from '../models/Donor.js';

export const createOrUpdateDonor = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const payload = {
      user: req.user._id,
      bloodGroup: req.body.bloodGroup,
      location: req.body.location,
      availability: req.body.availability,
      phone: req.body.phone,
      age: req.body.age,
      unitsAvailable: req.body.unitsAvailable,
      lastDonated: req.body.lastDonated || null,
      about: req.body.about,
    };

    const donor = await Donor.findOneAndUpdate(
      { user: req.user._id },
      payload,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).populate('user', 'name email phone role');

    return res.status(201).json(donor);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to save donor profile', error: error.message });
  }
};

export const getMyDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id }).populate('user', 'name email phone role');

    return res.json(donor);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch donor profile', error: error.message });
  }
};

export const searchDonors = async (req, res) => {
  try {
    const filter = {};

    if (req.query.bloodGroup) {
      filter.bloodGroup = req.query.bloodGroup;
    }

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    filter.availability = true;

    const donors = await Donor.find(filter)
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1 });

    return res.json(donors);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to search donors', error: error.message });
  }
};

export const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('user', 'name email phone');

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    return res.json(donor);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch donor', error: error.message });
  }
};

