// backend/models/Listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  specs: String,
  images: [String],
  unlockPrice: {
    type: Number,
    default: 99,
  },
  sellerInfo: {
    phone: String,
    address: String,
  },
  brand: {
    type: String,
    required: true, // Ensures admin selects it
  },
  machineType: {
    type: String,
    required: true, // Ensures admin selects it
  },
  isVisible: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
