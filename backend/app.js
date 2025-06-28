// backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const listingRoutes = require('./routes/listingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ✅ Add admin routes

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded image files from /uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ Routes
app.use('/api/listings', listingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes); // 👈 Prefix admin routes under /api/admin

module.exports = app;
