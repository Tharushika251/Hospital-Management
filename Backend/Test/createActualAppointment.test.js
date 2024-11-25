// src/tests/createActualAppointment.test.js

const mongoose = require('mongoose');
<<<<<<< Updated upstream
const { createActualAppointment } = require('../controllers/actualAppointmentController');
=======
const {
  createActualAppointment,
} = require('../controllers/actualAppointmentController');
>>>>>>> Stashed changes
const ActualAppointment = require('../models/ActualAppointment');

// Mock the ActualAppointment model
jest.mock('../models/ActualAppointment');

<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
describe('Create Actual Appointment', () => {
  it('should create a new appointment successfully', async () => {
    const appointmentData = {
      patientId: '12345',
      patientName: 'John Doe',
      email: 'john.doe@example.com',
      date: new Date(),
      time: '10:00 AM',
      hospitalname: 'General Hospital',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
    };

    // Mock the save method to return the appointment data
    ActualAppointment.mockImplementation(() => {
      return {
        save: jest.fn().mockResolvedValue(appointmentData),
      };
    });

    const savedAppointment = await createActualAppointment(appointmentData);

    expect(savedAppointment).toEqual(appointmentData);
    expect(ActualAppointment).toHaveBeenCalledWith(appointmentData);
  });

  it('should throw an error if appointment creation fails', async () => {
    const appointmentData = {
      patientId: '12345',
      patientName: 'John Doe',
      email: 'john.doe@example.com',
      date: new Date(),
      time: '10:00 AM',
      hospitalname: 'General Hospital',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
    };

    // Mock the save method to reject with an error
    ActualAppointment.mockImplementation(() => {
      return {
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      };
    });

<<<<<<< Updated upstream
    await expect(createActualAppointment(appointmentData)).rejects.toThrow('Error creating appointment: Database error');
=======
    await expect(createActualAppointment(appointmentData)).rejects.toThrow(
      'Error creating appointment: Database error'
    );
>>>>>>> Stashed changes
  });
});
