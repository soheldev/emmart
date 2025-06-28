// backend/controllers/listingController.js
const Listing = require('../models/Listing');
const { successResponse } = require('../utils/response');

exports.getAllListings = async (req, res) => {
  const listings = await Listing.find({ isVisible: true }).select('-sellerInfo');
  return res.json(successResponse('Listings fetched', listings));
};

exports.getListingById = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json(successResponse('Listing details', listing));
};

exports.createListing = async (req, res) => {
  const listing = await Listing.create(req.body);
  res.status(201).json(successResponse('Listing created', listing));
};

exports.toggleVisibility = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  listing.isVisible = !listing.isVisible;
  await listing.save();
  res.json(successResponse('Visibility updated', listing));
};
