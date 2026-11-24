const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  building_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true,
  },
  room_number: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  monthly_rate: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available',
  },
  amenities: {
    type: [String], // e.g., ["Aircon", "Wi-Fi", "Own CR"]
    default: [],
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
