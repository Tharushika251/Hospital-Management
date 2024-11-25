// src/routes/doctorAvailabilityRouter.js

const express = require('express');
const DoctorAvailability = require('../models/DoctorAvailability');

const router = express.Router();

// Create a new availability entry for a doctor
router.post('/', async (req, res) => {
  const { doctorId, doctorName, specialization, date, startTime, endTime, isAvailable } = req.body;

  try {
    const newAvailability = new DoctorAvailability({
      doctorId,
      doctorName,
      specialization,
      date,
      startTime,
      endTime,
      isAvailable,
    });

    const savedAvailability = await newAvailability.save();
    res.status(201).json(savedAvailability);
  } catch (error) {
    console.error('Error creating doctor availability:', error);
    res.status(400).json({ message: error.message });
  }
});

// Retrieve all availability entries
router.get('/', async (req, res) => {
  try {
    const availabilities = await DoctorAvailability.find();
    res.status(200).json(availabilities);
  } catch (error) {
    console.error('Error fetching doctor availabilities:', error);
    res.status(500).json({ message: error.message });
  }
});

// Retrieve availability for a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
  const { doctorId } = req.params;

  try {
    const availability = await DoctorAvailability.find({ doctorId });
    if (availability.length === 0) {
      return res.status(404).json({ message: 'Doctor availability not found' });
    }
    res.status(200).json(availability);
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update a doctor's availability
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { doctorId, doctorName, specialization, date, startTime, endTime, isAvailable } = req.body;

  try {
    const updatedAvailability = await DoctorAvailability.findByIdAndUpdate(
      id,
      { doctorId, doctorName, specialization, date, startTime, endTime, isAvailable },
      { new: true, runValidators: true }
    );

    if (!updatedAvailability) {
      return res.status(404).json({ message: 'Doctor availability not found' });
    }

    res.status(200).json(updatedAvailability);
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a doctor's availability entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAvailability = await DoctorAvailability.findByIdAndDelete(id);
    if (!deletedAvailability) {
      return res.status(404).json({ message: 'Doctor availability not found' });
    }
    res.status(204).json(); // No content
  } catch (error) {
    console.error('Error deleting doctor availability:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
