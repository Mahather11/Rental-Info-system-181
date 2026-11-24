const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tenancy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenancy',
    required: true,
  },
  billing_month: {
    type: String, // e.g., "2026-11"
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reference_no: {
    type: String,
    required: true,
  },
  receipt_image_url: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  rejection_reason: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);