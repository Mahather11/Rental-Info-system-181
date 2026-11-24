const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// @route   POST /api/rooms
// @desc    Create a new room inside a building
router.post('/', async (req, res) => {
  try {
    const { building_id, room_number, capacity, monthly_rate, amenities } = req.body;

    const newRoom = new Room({
      building_id,
      room_number,
      capacity,
      monthly_rate,
      amenities
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rooms/:building_id
// @desc    Get all rooms for a specific building
router.get('/:building_id', async (req, res) => {
  try {
    const rooms = await Room.find({ building_id: req.params.building_id });
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
