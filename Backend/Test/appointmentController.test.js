// src/tests/createAppointment.test.js

<<<<<<< Updated upstream
const { createAppointment } = require('../controllers/appointmentController.js');
=======
const {
  createAppointment,
} = require('../controllers/appointmentController.js');
>>>>>>> Stashed changes
const Appointment = require('../models/Appointment');

// Mock the Appointment model
jest.mock('../models/Appointment');

describe('Create Appointment', () => {
  it('should create a new appointment successfully', async () => {
    const appointmentData = {
      patientId: '67890',
      patientName: 'Jane Doe',
      email: 'jane.doe@example.com',
      date: new Date(),
      time: '11:00 AM',
      reason: 'Routine Checkup',
    };

    // Mock the save method to return the appointment data
    Appointment.mockImplementation(() => {
      return {
        save: jest.fn().mockResolvedValue(appointmentData),
      };
    });

    const req = { body: appointmentData }; // Simulate request object
    const res = {
      status: jest.fn().mockReturnThis(), // Mock response status
      json: jest.fn(), // Mock response json method
    };

    await createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Appointment created successfully',
      appointment: appointmentData,
    });
    expect(Appointment).toHaveBeenCalledWith(appointmentData);
  });

  it('should return an error if appointment creation fails', async () => {
    const appointmentData = {
      patientId: '67890',
      patientName: 'Jane Doe',
      email: 'jane.doe@example.com',
      date: new Date(),
      time: '11:00 AM',
      reason: 'Routine Checkup',
    };

    // Mock the save method to reject with an error
    Appointment.mockImplementation(() => {
      return {
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      };
    });

    const req = { body: appointmentData }; // Simulate request object
    const res = {
      status: jest.fn().mockReturnThis(), // Mock response status
      json: jest.fn(), // Mock response json method
    };

    await createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error creating appointment',
      error: 'Database error',
    });
  });
});
