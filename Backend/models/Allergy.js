const mongoose = require('mongoose');

const AllergySchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    severity: { type: String, enum: ['low', 'high'], required: true },
});

module.exports = mongoose.model('Allergy', AllergySchema);
