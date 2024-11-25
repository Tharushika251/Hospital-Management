// src/controllers/appointmentController.js

const Appointment = require('../models/Appointment');

// Create a new appointment
const createAppointment = async (req, res) => {
  const appointmentData = req.body; // Get appointment data from the request body
  const appointment = new Appointment(appointmentData);
  
  try {
    const savedAppointment = await appointment.save();
    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: savedAppointment,
    });
  } catch (err) {
    res.status(400).json({
      message: 'Error creating appointment',
      error: err.message,
    });
  }
};



module.exports = {
  createAppointment,
  
};
