const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// @route   POST /api/payments
// @desc    Student submits a payment
router.post('/', async (req, res) => {
  try {
    const { tenancy_id, billing_month, amount, reference_no, receipt_image_url } = req.body;

    const newPayment = new Payment({
      tenancy_id,
      billing_month,
      amount,
      reference_no,
      receipt_image_url
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payments/pending
// @desc    Manager gets all pending payments to review
router.get('/pending', async (req, res) => {
  try {
    // Populate allows us to see the Tenancy details inside the Payment
    const payments = await Payment.find({ status: 'pending' }).populate('tenancy_id');
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/payments/:id
// @desc    Manager verifies or rejects a payment
router.put('/:id', async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status, rejection_reason },
      { new: true }
    );

    res.json(updatedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;