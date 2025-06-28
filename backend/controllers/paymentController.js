const Razorpay = require('razorpay');
const crypto = require('crypto');
const Listing = require('../models/Listing');
const Payment = require('../models/Payment');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Step 1: Create Razorpay order
exports.initiatePayment = async (req, res) => {
  const { listingId, buyerName } = req.body;

  if (!listingId || !buyerName) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const listing = await Listing.findById(listingId);
  if (!listing || !listing.isVisible) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const amount = listing.unlockPrice * 100;

  const options = {
    amount,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: { listingId, buyerName },
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      listingId,
      buyerName,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// ✅ Step 2: Verify payment and store
exports.verifyAndStorePayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    listingId,
    buyerName,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment data' });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(403).json({ error: 'Signature mismatch' });
  }

  try {
    const listing = await Listing.findById(listingId);
    const payment = new Payment({
      listingId,
      buyerName,
      amount: listing.unlockPrice,
      razorpayPaymentId: razorpay_payment_id,
      success: true,
    });

    await payment.save();
    res.json({ message: 'Payment verified', success: true });
  } catch (err) {
    console.error('Payment save error:', err);
    res.status(500).json({ error: 'Failed to save payment' });
  }
};

// ✅ Step 3: Check if user already paid for listing
exports.checkPayment = async (req, res) => {
  const { listingId, buyerName } = req.body;

  if (!listingId || !buyerName) {
    return res.status(400).json({ error: 'Missing input' });
  }

  try {
    const paid = await Payment.findOne({ listingId, buyerName, success: true });
    res.json({ unlocked: !!paid });
  } catch (err) {
    res.status(500).json({ error: 'Payment check failed' });
  }
};
