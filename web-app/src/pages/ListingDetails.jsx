// web-app/src/pages/ListingDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [buyerName, setBuyerName] = useState(() => {
    const stored = localStorage.getItem('buyerName');
    if (stored) return stored;
    const name = prompt('Enter your name:');
    if (name) {
      localStorage.setItem('buyerName', name);
      return name;
    }
    return '';
  });

  useEffect(() => {
    if (!buyerName) return;
    fetchListing();
    checkIfPaid();

    // Ensure Razorpay script is loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data.data);
    } catch {
      alert('Listing not found');
    } finally {
      setLoading(false);
    }
  };

  const checkIfPaid = async () => {
    try {
      const res = await api.post('/payments/check', { listingId: id, buyerName });
      setShowContact(res.data.unlocked);
    } catch {
      setShowContact(false);
    }
  };

  const handlePayment = async () => {
    if (!buyerName || !listing) return;

    try {
      setProcessing(true);
      const res = await api.post('/payments/initiate', { listingId: id, buyerName });
      const { key, orderId, amount, currency } = res.data;

      const options = {
        key,
        amount,
        currency,
        name: "Emmart",
        description: "Unlock Seller Contact Info",
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payments/verify', {
              ...response,
              listingId: id,
              buyerName,
            });

            if (verifyRes.data.success) {
              alert('Payment successful!');
              setShowContact(true);
            } else {
              alert('Payment verification failed.');
            }
          } catch {
            alert('Something went wrong during verification.');
          }
        },
        prefill: { name: buyerName },
        theme: { color: "#1D4ED8" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading listing...</p>;
  if (!listing) return <p className="p-8 text-center">Listing not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-600 mb-4">{listing.location}</p>
      <div className="mb-4">Price: ₹{listing.price}</div>
      <div className="mb-4">Brand: {listing.brand} | Type: {listing.machineType}</div>
      <div className="mb-4 text-sm text-gray-700">{listing.specs}</div>

      {listing.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          {listing.images.map((img, i) => (
            <img key={i} src={img} alt={`img${i}`} className="w-full h-40 object-cover rounded" />
          ))}
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        {showContact ? (
          <div className="text-green-800">
            <p><strong>Phone:</strong> {listing.sellerInfo.phone}</p>
            <p><strong>Address:</strong> {listing.sellerInfo.address}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-700">Pay ₹{listing.unlockPrice} to unlock contact info</p>
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={processing}
            >
              {processing ? 'Processing...' : `Unlock Contact ₹${listing.unlockPrice}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
