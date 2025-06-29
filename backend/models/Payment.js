const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  razorpayPaymentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'success'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
