const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'manager'],
    default: 'student',
  },
  // Manager specific field
  payment_qr_url: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);