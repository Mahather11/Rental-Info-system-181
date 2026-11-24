const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Building', buildingSchema);