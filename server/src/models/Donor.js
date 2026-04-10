import mongoose from 'mongoose';

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: bloodGroups,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 65,
      required: true,
    },
    unitsAvailable: {
      type: Number,
      min: 1,
      default: 1,
    },
    lastDonated: {
      type: Date,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

donorSchema.index({ bloodGroup: 1, location: 1, availability: 1 });

const Donor = mongoose.model('Donor', donorSchema);

export default Donor;

