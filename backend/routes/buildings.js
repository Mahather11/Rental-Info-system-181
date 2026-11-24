const express = require('express');
const router = express.Router();
const Building = require('../models/Building');

// @route   POST /api/buildings
// @desc    Create a new building
router.post('/', async (req, res) => {
  try {
    // We are extracting these exact names from Thunder Client
    const { manager_id, name, address } = req.body;

    const newBuilding = new Building({
      manager_id: manager_id,
      name: name,
      address: address
    });

    const savedBuilding = await newBuilding.save();
    res.status(201).json(savedBuilding);
  } catch (error) {
    console.error("FULL ERROR DETAILS:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;