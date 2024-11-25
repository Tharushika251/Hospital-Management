// /backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


// Protecting the admin routes with the auth middleware
router.post('/records',  adminController.addRecord); // Requires authentication
router.get('/records',  adminController.getAllRecords); // Requires authentication
router.get('/report/:id', adminController.generatePDF); // Requires authentication
router.get('/patients', adminController.getPatients); // New endpoint to get patients

module.exports = router;
