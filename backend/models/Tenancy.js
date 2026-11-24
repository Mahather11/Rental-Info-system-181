const mongoose = require('mongoose');

const tenancySchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  status: {
    type: String,
    enum: ['requested', 'active', 'rejected', 'ended'],
    default: 'requested',
  },
  reason_for_leaving: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Tenancy', tenancySchema);