// src/controllers/doctorAvailabilityController.js

const DoctorAvailability = require('../models/DoctorAvailability');

// Create a new doctor availability
const createDoctorAvailability = async (availabilityData) => {
  const availability = new DoctorAvailability(availabilityData);
  try {
    const savedAvailability = await availability.save();
    return savedAvailability;
  } catch (err) {
    throw new Error('Error creating doctor availability: ' + err.message);
  }
};



module.exports = {
  createDoctorAvailability,
 
};
