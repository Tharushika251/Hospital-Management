const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  createBill,
  getAllBills,
  getBillById,
  updateBillPayment,
  getBillsByUserId,
  getPaymentHistoryByUserId,
  deleteBill,
  updateBill,
} = require('../controllers/billController');

const router = express.Router();

// Create a new bill
router.post(
  '/addBill',
  asyncHandler(async (req, res) => {
    const newBill = await createBill(req.body);
    res.status(201).json(newBill);
  })
);

// Route to get all bills
router.get('/AllBill', getAllBills);

// Get a bill by ID
router.get(
  '/getBill/:id',
  asyncHandler(async (req, res) => {
    const bill = await getBillById(req.params.id);
    res.json(bill);
  })
);

// Get bills for a user
router.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const bills = await getBillsByUserId(req.params.userId);
    res.json(bills);
  })
);

// Update payment status of a bill
router.put(
  '/payment/:id',
  asyncHandler(updateBillPayment) // Directly passing the function as the handler
);


// Get payment history for a user
router.get(
  '/user/:userId/history',
  asyncHandler(async (req, res) => {
    const history = await getPaymentHistoryByUserId(req.params.userId);
    res.json(history);
  })
);

// Route to delete a bill by ID
router.delete('/deleteBill/:id', deleteBill);

// Route to update a bill by ID
router.put('/update/:id', updateBill);

module.exports = router;
