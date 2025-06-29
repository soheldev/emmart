const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Listing = require('../models/Listing');
const Payment = require('../models/Payment');

// ✅ Middleware: Verify Admin Token
const verifyAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.sendStatus(401);
  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.sendStatus(403);
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

// ✅ Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASS;

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// ✅ Dashboard Stats
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: 'success' });

    const allPayments = await Payment.find({ status: 'success' });
    const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyPayments = await Payment.find({
      status: 'success',
      createdAt: { $gte: startOfMonth }
    });

    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalListings,
      totalPayments,
      totalRevenue,
      monthlyRevenue
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ✅ Get Payment Logs
router.get('/payments', verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .populate('listingId', 'title');

    const formatted = payments.map(p => ({
      id: p._id,
      buyerName: p.buyerName,
      buyerPhone: p.buyerPhone,
      amount: p.amount,
      status: p.status,
      createdAt: p.createdAt,
      listingTitle: p.listingId?.title || p.listingId?.toString(),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// ✅ Toggle Listing Visibility
router.patch('/listings/:id/visibility', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { isVisible } = req.body;

  try {
    const updated = await Listing.findByIdAndUpdate(id, { isVisible }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Visibility updated', data: updated });
  } catch (err) {
    console.error('Visibility update failed:', err);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
});

// ✅ Create New Listing
router.post('/listings', verifyAdmin, async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const saved = await newListing.save();
    res.status(201).json({ message: 'Listing created', data: saved });
  } catch (err) {
    console.error('Create failed:', err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// ✅ Update Listing
router.put('/listings/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Listing updated', data: updated });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// ✅ Delete Listing
router.delete('/listings/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;
