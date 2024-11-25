const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: String, required: true },
    hospital: { type: String, required: true },
    date: { type: Date, required: true },
    medication: { type: String, required: true },
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
