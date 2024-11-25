// src/routes/actualAppointmentsRouter.js

const express = require('express');
const ActualAppointment = require('../models/ActualAppointment');

const actualAppointmentsRouter = express.Router();

// Create a new appointment
actualAppointmentsRouter.post('/', async (req, res) => {
  const { patientId, patientName, email, date, time, hospitalname, doctorName, specialization } = req.body;

  try {
    const newAppointment = new ActualAppointment({
      patientId,
      patientName,
      email,
      date,
      time,
      hospitalname,
      doctorName,
      specialization,
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Retrieve all appointments
actualAppointmentsRouter.get('/', async (req, res) => {
  try {
    const appointments = await ActualAppointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an appointment by ID
actualAppointmentsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { patientId, patientName, email, date, time, hospitalname, doctorName, specialization } = req.body;

  try {
    const updatedAppointment = await ActualAppointment.findByIdAndUpdate(
      id,
      { patientId, patientName, email, date, time, hospitalname,doctorName, specialization },
      { new: true } // Return the updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an appointment by ID
actualAppointmentsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await ActualAppointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = actualAppointmentsRouter;
