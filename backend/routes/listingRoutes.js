const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// ✅ GET /api/listings?brand=JCB&machineType=Excavator&search=loader&location=Pune
router.get('/', async (req, res) => {
  const { brand, machineType, search, location } = req.query;
  const filter = { isVisible: true };

  if (brand) filter.brand = brand;
  if (machineType) filter.machineType = machineType;
  if (location) filter.location = new RegExp(location, 'i');
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { specs: new RegExp(search, 'i') },
      { brand: new RegExp(search, 'i') },
      { machineType: new RegExp(search, 'i') },
    ];
  }

  try {
    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json({ data: listings });
  } catch (err) {
    console.error('Filter error:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// ✅ GET single listing (for public view)
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing || !listing.isVisible) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ data: listing });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

module.exports = router;
