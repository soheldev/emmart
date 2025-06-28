const Listing = require('../models/Listing');
const uploadToCloud = require('../utils/imageUploader');

exports.createListing = async (req, res) => {
  try {
    const { title, price, location, specs, unlockPrice, sellerPhone, sellerAddress, brand, machineType } = req.body;

    if (!brand || !machineType) {
      return res.status(400).json({ error: 'Brand and Machine Type are required.' });
    }

    const images = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files.slice(0, 6)) {
        const url = await uploadToCloud(file);
        images.push(url);
      }
    }

    const listing = new Listing({
      title, price, location, specs, unlockPrice,
      brand, machineType,
      sellerInfo: { phone: sellerPhone, address: sellerAddress },
      images
    });

    await listing.save();
    res.status(201).json({ message: 'Listing created', listing });

  } catch (err) {
    console.error('Create Listing Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
