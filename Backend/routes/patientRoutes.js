const express = require('express');
const router = express.Router();
const { 
    getPatientRecords, 
    getPatientPrescriptions, 
    getPatientAllergies 
} = require('../controllers/patientController'); // Destructure to get the functions directly


// Route for patients to view their own medical records
router.get('/records',  getPatientRecords); // Use auth middleware

// Get Prescriptions
router.get('/prescriptions',  getPatientPrescriptions); // Use the correct function

// Get Allergies
router.get('/allergies', getPatientAllergies); // Use the correct function

module.exports = router;
