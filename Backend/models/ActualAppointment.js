// src/models/ActualAppointment.js

const mongoose = require('mongoose');

const ActualAppointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true, // Assuming patient ID is required
  },
  patientName: {
    type: String,
    required: true, // Assuming patient name is required
  },
  email: {
    type: String,
    required: true, // Assuming email is required for notifications
    validate: {
      validator: function (v) {
        // Simple regex for validating email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  hospitalname: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true, // Assuming doctor's name is required
  },
  specialization: {
    type: String,
    required: true, // Assuming specialization is required
  },
}, {
  timestamps: true, // This will add createdAt and updatedAt fields
});

module.exports = mongoose.model('ActualAppointment', ActualAppointmentSchema);
