const express = require('express');
const router = express.Router();
const Tenancy = require('../models/Tenancy');

// @route   POST /api/tenancies
// @desc    Student requests to rent a room
router.post('/', async (req, res) => {
  try {
    const { student_id, room_id } = req.body;

    const newTenancy = new Tenancy({
      student_id,
      room_id
    });

    const savedTenancy = await newTenancy.save();
    res.status(201).json(savedTenancy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;