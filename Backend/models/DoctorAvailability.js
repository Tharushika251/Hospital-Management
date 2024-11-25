// src/models/DoctorAvailability.js

const mongoose = require('mongoose');

const DoctorAvailabilitySchema = new mongoose.Schema({
  doctorId: {
    type: String, // or ObjectId if using MongoDB's ObjectId
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Use a standardized format like "HH:MM"
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DoctorAvailability', DoctorAvailabilitySchema);
