// backend/models/Listing.js

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  vehicleType: { type: String, required: true },
  company: { type: String, required: true },
  machineType: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  ownerName: { type: String },
  contactAddress: { type: String },
  specs: { type: String },
  image: { type: String }, // Filename saved by multer
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
