const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateOfVisit: { type: Date, required: true },
    reasonForVisit: { type: String, required: true },
    hospital: { type: String, required: true },
    attendingDoctor: { type: String, required: true },
    diagnosis: { type: String, required: true },
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
