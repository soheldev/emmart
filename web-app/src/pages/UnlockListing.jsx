import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api'; // Your axios setup

export default function UnlockListing() {
  const { id } = useParams(); // listingId
  const [listing, setListing] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`).then(res => setListing(res.data.data));
  }, [id]);

  useEffect(() => {
    if (buyerName.length >= 3) checkIfUnlocked();
  }, [buyerName]);

  const checkIfUnlocked = async () => {
    try {
      const res = await api.post('/payments/check', { listingId: id, buyerName });
      setIsUnlocked(res.data.unlocked);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async () => {
    if (!buyerName) return alert('Enter your name');

    try {
      const order = await api.post('/payments/initiate', { listingId: id, buyerName });

      const options = {
        key: order.data.key,
        amount: order.data.amount,
        currency: order.data.currency,
        order_id: order.data.orderId,
        name: 'Emmart Unlock',
        description: `Unlock ${listing.title}`,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              listingId: id,
              buyerName,
            });
            setIsUnlocked(true);
            alert('Contact unlocked!');
          } catch (err) {
            alert('Verification failed');
            console.error(err);
          }
        },
        prefill: { name: buyerName },
        theme: { color: '#1976D2' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment initiation failed');
    }
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <p><strong>Price:</strong> ₹{listing.price}</p>
      <p><strong>Unlock Price:</strong> ₹{listing.unlockPrice}</p>

      {isUnlocked ? (
        <div className="mt-6 p-4 border bg-green-100 rounded">
          <p><strong>Phone:</strong> {listing.sellerInfo.phone}</p>
          <p><strong>Address:</strong> {listing.sellerInfo.address}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handlePayment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Pay ₹{listing.unlockPrice} to Unlock
          </button>
        </div>
      )}
    </div>
  );
}
