const express = require('express');
const router = express.Router();
const paymentHistoryController = require('../controllers/paymentHistoryController');

// Create a new payment
router.post('/create', paymentHistoryController.createPayment);

// Get all payments
router.get('/', paymentHistoryController.getPayments);

// Get payment by ID
router.get('/:id', paymentHistoryController.getPaymentById);

// Update payment status (approve/reject slip)
router.put('/status/:id', paymentHistoryController.updatePaymentStatus);

// Delete payment
router.delete('/:id', paymentHistoryController.deletePayment);

module.exports = router;
