const mongoose = require('mongoose');

const chatPatientSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('ChatPatient', chatPatientSchema);
