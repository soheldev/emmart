const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Listing = require('../models/Listing');
const Payment = require('../models/Payment');

// 📦 Multer Setup — limit to 6 images max
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname)),
  }),
  limits: { files: 6 }, // enforce max 6 files on backend
});

// ✅ GET all listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json({ data: listings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// ✅ POST new listing with images (max 6)
router.post('/listings', upload.array('images', 6), async (req, res) => {
  try {
    if (req.files.length > 6) {
      return res.status(400).json({ error: 'Only 6 images allowed' });
    }

    const {
      title,
      price,
      location,
      specs,
      unlockPrice,
      sellerPhone,
      sellerAddress,
    } = req.body;

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const listing = new Listing({
      title,
      price,
      location,
      specs,
      unlockPrice: unlockPrice || 99,
      visible: true,
      images: imagePaths,
      sellerInfo: {
        phone: sellerPhone,
        address: sellerAddress,
      },
    });

    await listing.save();
    res.json({ message: 'Listing created successfully' });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// ✅ Toggle visibility
router.put('/listings/:id/toggle', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    listing.visible = !listing.visible;
    await listing.save();
    res.json({ message: 'Visibility updated' });
  } catch (err) {
    res.status(500).json({ error: 'Toggle failed' });
  }
});

// ✅ Delete listing
router.delete('/listings/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ Get all payment logs
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    const result = payments.map((p) => ({
      ...p._doc,
      listingTitle: p.listingTitle || 'Unknown',
    }));
    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
