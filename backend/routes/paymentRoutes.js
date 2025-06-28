// backend/controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Listing = require('../models/Listing');
const Payment = require('../models/Payment');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Step 1: Initiate Order
exports.initiatePayment = async (req, res) => {
  const { listingId, buyerName } = req.body;

  if (!listingId || !buyerName) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const listing = await Listing.findById(listingId);
  if (!listing || !listing.isVisible) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const amount = listing.unlockPrice * 100; // Razorpay uses paisa

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
    console.error('Razorpay create error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

// Step 2: Verify Signature and Store Payment
exports.verifyAndStorePayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    listingId,
    buyerName,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Incomplete payment details' });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(403).json({ error: 'Signature mismatch - fraud attempt?' });
  }

  try {
    const payment = new Payment({
      listingId,
      buyerName,
      amount: (await Listing.findById(listingId)).unlockPrice,
      razorpayPaymentId: razorpay_payment_id,
      success: true,
    });

    await payment.save();
    res.json({ message: 'Payment verified and recorded', success: true });
  } catch (err) {
    console.error('Payment verification failed:', err);
    res.status(500).json({ error: 'Failed to save payment' });
  }
};
