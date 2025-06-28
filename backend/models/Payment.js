// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  buyerName: String,
  amount: Number,
  razorpayPaymentId: String,
  success: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
