import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PayPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        setListing(res.data?.data);
      } catch (err) {
        console.error('Error fetching listing:', err);
      }
    };
    fetchListing();
  }, [id]);

  const handleUPIPayment = () => {
    // In production, replace with Razorpay flow
    alert('Simulating UPI payment...');
    setHasPaid(true);
  };

  if (!listing) {
    return <div className="p-6 text-center">Loading listing...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img
        src={listing.images?.[0] || 'https://via.placeholder.com/600x400'}
        alt={listing.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-700 mb-2">Brand: {listing.brand}</p>
      <p className="text-gray-700 mb-2">Type: {listing.machineType}</p>
      <p className="text-gray-700 mb-2">Location: {listing.location}</p>
      <p className="text-gray-900 font-semibold text-lg mb-4">Price: ₹{listing.price}</p>
      <p className="mb-4">{listing.specs}</p>

      {!hasPaid ? (
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">
            Pay ₹{listing.contactFee || 99} to view seller contact details.
          </p>
          <button
            onClick={handleUPIPayment}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Pay Now (UPI)
          </button>
        </div>
      ) : (
        <div className="mt-6 p-4 border rounded shadow bg-green-50">
          <h3 className="text-lg font-semibold mb-2">Seller Contact Info</h3>
          <p><strong>Name:</strong> {listing.ownerName}</p>
          <p><strong>Phone:</strong> {listing.contactNumber}</p>
          <p><strong>Address:</strong> {listing.contactAddress}</p>
        </div>
      )}
    </div>
  );
}

export default PayPage;
