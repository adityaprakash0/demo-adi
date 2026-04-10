import mongoose from 'mongoose';
import { bloodGroups } from './Donor.js';

const emergencyRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: bloodGroups,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    unitsNeeded: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Critical'],
      default: 'Urgent',
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    requiredBy: {
      type: Date,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['Open', 'Matched', 'Closed'],
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

const EmergencyRequest = mongoose.model('EmergencyRequest', emergencyRequestSchema);

export default EmergencyRequest;

