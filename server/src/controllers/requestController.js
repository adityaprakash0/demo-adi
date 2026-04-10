import { validationResult } from 'express-validator';
import EmergencyRequest from '../models/EmergencyRequest.js';

export const createEmergencyRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const request = await EmergencyRequest.create({
      requester: req.user._id,
      patientName: req.body.patientName,
      bloodGroup: req.body.bloodGroup,
      hospitalName: req.body.hospitalName,
      location: req.body.location,
      unitsNeeded: req.body.unitsNeeded,
      urgency: req.body.urgency,
      contactNumber: req.body.contactNumber,
      requiredBy: req.body.requiredBy || null,
      message: req.body.message,
    });

    return res.status(201).json(request);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create emergency request', error: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ requester: req.user._id }).sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch requests', error: error.message });
  }
};

export const getOpenRequests = async (_req, res) => {
  try {
    const requests = await EmergencyRequest.find({ status: 'Open' })
      .populate('requester', 'name phone email')
      .sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch open requests', error: error.message });
  }
};

export const updateEmergencyRequestStatus = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const request = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    return res.json(request);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update request status', error: error.message });
  }
};

