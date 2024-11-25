// src/routes/appointments.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Create a new appointment
router.post('/create', async (req, res) => {
  try {
    const { patientId, patientName,email, date, time, reason } = req.body;

    const newAppointment = new Appointment({
      patientId,
      patientName,
      date,
      email,
      time,
      reason,
    });

    await newAppointment.save();
    return res.status(201).json({ message: 'Appointment created successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Delete an appointment by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    return res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
});

module.exports = router;
