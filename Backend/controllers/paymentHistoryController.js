const PaymentHistory = require('../models/PaymentHistory');

// Create new payment
exports.createPayment = async (req, res) => {
  try {
    const { billId, userId, method, email, amount, slip } = req.body;

    const newPayment = new PaymentHistory({
      billId,
      userId,
      method,
      email,
      amount,
      slip,
      status: method === 'offline' ? 'pending' : 'approved', // Automatically approve online payments
    });

    await newPayment.save();
    res
      .status(201)
      .json({ message: 'Payment created successfully', payment: newPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create payment', error: error.message });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await PaymentHistory.find().sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch payments', error: error.message });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await PaymentHistory.findById(req.params.id).populate(
      'billId userId'
    );
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch payment', error: error.message });
  }
};

// Update payment status (approve or reject slip)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body; // status can be 'approved' or 'rejected'
    const payment = await PaymentHistory.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Only update status for offline payments
    if (payment.method === 'offline') {
      payment.status = status;
      await payment.save();
      res
        .status(200)
        .json({ message: `Payment slip has been ${status}`, payment });
    } else {
      res
        .status(400)
        .json({ message: 'Only offline payments can be approved or rejected' });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Failed to update payment status',
        error: error.message,
      });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await PaymentHistory.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await payment.remove();
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete payment', error: error.message });
  }
};
