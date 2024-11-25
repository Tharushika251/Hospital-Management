const ActualAppointment = require('../models/ActualAppointment');

// Create a new actual appointment
const createActualAppointment = async (appointmentData) => {
  const appointment = new ActualAppointment(appointmentData);
  try {
    const savedAppointment = await appointment.save();
    return savedAppointment;
  } catch (err) {
    throw new Error('Error creating appointment: ' + err.message);
  }
};






module.exports = {
  createActualAppointment,

};
