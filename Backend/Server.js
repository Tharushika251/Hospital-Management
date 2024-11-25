const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoConnection = require('./util/MongoConnection');
const billRoutes = require('./routes/MedicalBillRouter');
const appointmentRoutes = require('./routes/AppointmentRouter');
const actualAppointmentsRouter = require('./routes/actualAppointmentsRouter');
const DoctorAvailability = require('./routes/doctorAvailabilityRouter');
const chatRoutes = require('./routes/ChatRouter');
const path = require('path');
const chatPatientRoutes = require('./routes/chatPatients');
const userRoutes = require('./routes/userRout');
const paymentHistoryRoutes = require('./routes/paymentHistoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Load environment variables from .env
dotenv.config();

// Middleware setup
const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

(async () => {
  try {
    await mongoConnection.connect();
    // Start server here
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
})();

app.use('/appointments', appointmentRoutes); // Use AppointmentRouter
app.use('/actual-appointments', actualAppointmentsRouter);
app.use('/bills', billRoutes);
app.use('/doctor-availability', DoctorAvailability); // New doctor availability route
app.use('/chat', chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/chatPatients', chatPatientRoutes);
app.use('/user', userRoutes);
app.use('/payment', paymentHistoryRoutes);
// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/user', userRoutes);

// Serve PDFs
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));


// Add a base route to confirm server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 8500;
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});

