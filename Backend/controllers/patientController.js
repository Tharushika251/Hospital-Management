// /backend/controllers/patientController.js
const MedicalRecord = require('../models/MedicalRecord');

// Patient: View their medical records
exports.getPatientRecords = async (req, res) => {
    try {
        const patientId = req.user.id;  // Use the user ID from the JWT token
        const records = await MedicalRecord.find({ patientId }).populate('patientId', 'username'); // Populate patient details
        res.json(records);
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};

// Get Active Prescriptions
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const patientId = req.user._id;
        const prescriptions = await Prescription.find({ patientId });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get Allergies
exports.getPatientAllergies = async (req, res) => {
    try {
        const patientId = req.user._id;
        const allergies = await Allergy.find({ patientId });
        res.json(allergies);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};
