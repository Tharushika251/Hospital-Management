// src/routes/patientRouter.js

const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientcontrollers');

const router = express.Router();

// Create a new patient
router.post(
  '/patients',
  asyncHandler(async (req, res) => {
    const newPatient = await createPatient(req.body);
    res.status(201).json(newPatient);
  })
);

// Get all patients
router.get(
  '/patients',
  asyncHandler(async (req, res) => {
    const patients = await getAllPatients();
    res.status(200).json(patients);
  })
);

// Get a patient by ID
router.get(
  '/patients/:id',
  asyncHandler(async (req, res) => {
    const patient = await getPatientById(req.params.id);
    res.status(200).json(patient);
  })
);

// Update a patient by ID
router.put(
  '/patients/:id',
  asyncHandler(async (req, res) => {
    const updatedPatient = await updatePatient(req.params.id, req.body);
    res.status(200).json(updatedPatient);
  })
);

// Delete a patient by ID
router.delete(
  '/patients/:id',
  asyncHandler(async (req, res) => {
    const deletedPatient = await deletePatient(req.params.id);
    res.status(200).json(deletedPatient);
  })
);

module.exports = router;
