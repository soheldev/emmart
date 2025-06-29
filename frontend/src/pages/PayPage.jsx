import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [error, setError] = useState('');
  const [buyerName, setBuyerName] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        if (!res.data?.data) throw new Error('Listing not found');
        setListing(res.data.data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('This listing is unavailable or has been removed.');
        setTimeout(() => navigate('/'), 3000);
      }
    };
    fetchListing();
  }, [id, navigate]);

  const handleRazorpay = async () => {
    if (!buyerName.trim()) return alert('Please enter your name');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/initiate`, {
        listingId: id,
        buyerName,
      });

      const { orderId, amount, currency, key } = res.data;

      const options = {
        key,
        amount,
        currency,
        name: listing.title,
        description: 'Unlock seller contact',
        image: listing.images?.[0],
        order_id: orderId,
        handler: async function (response) {
          const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
            ...response,
            listingId: id,
            buyerName,
          });

          if (verifyRes.data.success) {
            alert('✅ Payment successful');
            setHasPaid(true);
          } else {
            alert('❌ Payment verification failed');
          }
        },
        prefill: { name: buyerName },
        theme: { color: '#16a34a' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to initiate payment');
    }
  };

  if (error) {
    return <div className="p-6 text-center text-red-500 font-semibold">{error}</div>;
  }

  if (!listing) {
    return <div className="p-6 text-center">Loading listing details...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img
        src={listing.images?.[0] || 'https://via.placeholder.com/600x400'}
        alt={listing.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>

      <div className="text-sm text-gray-600 mb-2">
        <span className="inline-block px-2 py-1 bg-gray-200 rounded mr-2">{listing.brand}</span>
        <span className="inline-block px-2 py-1 bg-gray-200 rounded mr-2">{listing.machineType}</span>
        <span className="inline-block px-2 py-1 bg-gray-200 rounded">{listing.location}</span>
      </div>

      <p className="text-green-600 font-semibold text-lg mb-4">₹{listing.price}</p>

      <h2 className="text-md font-semibold mb-1">Specifications</h2>
      <p className="mb-6 whitespace-pre-line">{listing.specs || 'No additional details provided.'}</p>

      {!hasPaid ? (
        <div className="text-center mt-6">
          <p className="text-red-500 font-medium mb-2">
            Pay ₹{listing.unlockPrice || 99} to view seller contact details.
          </p>
          <input
            type="text"
            placeholder="Your Name"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="border px-3 py-2 rounded w-full max-w-sm mb-3"
          />
          <button
            onClick={handleRazorpay}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Pay & Unlock (Razorpay)
          </button>
        </div>
      ) : (
        <div className="mt-6 p-4 border rounded shadow bg-green-50">
          <h3 className="text-lg font-semibold mb-2">Seller Contact Info</h3>
          <p><strong>Phone:</strong> {listing.sellerInfo?.phone || 'Not available'}</p>
          <p><strong>Address:</strong> {listing.sellerInfo?.address || 'Not available'}</p>
        </div>
      )}
    </div>
  );
}

export default PayPage;
