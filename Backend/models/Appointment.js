// src/models/Appointment.js

const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true, // Assuming patient ID is required
  },
  patientName: {
    type: String,
    required: true, // Assuming patient name is required
  },
  date: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true, // Add email field and mark it as required
  },
  time: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
