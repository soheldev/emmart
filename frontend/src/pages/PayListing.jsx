// frontend/src/pages/PayListing.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PayListing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [form, setForm] = useState({
    buyerName: '',
    buyerPhone: '',
    amount: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((res) => setListing(res.data.data))
      .catch((err) => console.error('Failed to load listing', err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/payments`, {
        ...form,
        listingId: id,
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Payment submission failed:', err);
      alert('Failed to submit payment. Please try again.');
    }
  };

  if (!listing) return <div className="p-6">Loading...</div>;

  if (submitted) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">✅ Payment Details Submitted!</h2>
        <p className="mb-2">Your payment info was recorded. Admin will verify shortly.</p>
        <p className="text-sm text-gray-500">Thank you for using Emmart.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
      <img
        src={listing.images?.[0] || 'https://via.placeholder.com/400x300'}
        alt={listing.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-lg font-semibold text-green-700">₹{listing.price}</p>
      <p className="text-sm text-gray-600 mb-6">{listing.brand} • {listing.machineType} • {listing.location}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="buyerName"
          value={form.buyerName}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          name="buyerPhone"
          value={form.buyerPhone}
          onChange={handleChange}
          placeholder="Your Phone"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter Amount (₹)"
          required
          className="w-full border p-2 rounded"
        />

        <div className="bg-gray-100 p-4 rounded text-sm">
          <p className="font-semibold">📱 Send UPI to:</p>
          <p className="text-blue-600 break-words font-mono mt-1">{import.meta.env.VITE_ADMIN_UPI_ID || 'admin@upi'}</p>
          <p className="mt-2 text-gray-600">After payment, submit this form to notify the admin.</p>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Payment Info
        </button>
      </form>
    </div>
  );
}

export default PayListing;
