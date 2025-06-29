const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  unlockPrice: {
    type: Number,
    default: 99,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  specs: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  brand: {
    type: String,
    required: true,
  },
  machineType: {
    type: String,
    required: true,
  },
  sellerInfo: {
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    }
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});
