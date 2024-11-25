const mongoose = require('mongoose');

// Define the MedicalBill schema
const MedicalBillSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  patientID: {
    type: String,
    required: true,
  },
  appointmentID: {
    type: String,
    required: true,
  },
  treatmentDetails: [
    {
      description: String,
      amount: Number,
    },
  ],
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Insurance'],
    required: true,
  },
  paidStatus: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  balanceAmount: {
    type: Number,
    required: true,
  },
  insuranceDetails: {
    provider: String,
    policyNumber: String,
  },
});

module.exports = mongoose.model('MedicalBill', MedicalBillSchema);
