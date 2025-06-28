// web-app/src/pages/ListingDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data.data);
    } catch (err) {
      console.error('Failed to fetch listing:', err);
    }
  };

  const handleUnlock = async () => {
    const buyerName = prompt("Enter your name to proceed:");
    if (!buyerName) return;

    // Simulate successful unlock
    try {
      await api.post('/payments/initiate', {
        listingId: id,
        buyerName,
        amount: listing.unlockPrice,
      });

      alert('Payment successful. Contact info unlocked!');
      setUnlocked(true);
    } catch (err) {
      console.error('Unlock failed:', err);
      alert('Payment failed');
    }
  };

  if (!listing) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {listing.images.map((img, i) => (
          <img key={i} src={img} alt={`img${i}`} className="rounded shadow" />
        ))}
      </div>

      <p><strong>Brand:</strong> {listing.brand}</p>
      <p><strong>Machine Type:</strong> {listing.machineType}</p>
      <p><strong>Location:</strong> {listing.location}</p>
      <p><strong>Price:</strong> ₹{listing.price}</p>
      <p className="mb-4"><strong>Specs:</strong> {listing.specs}</p>

      {!unlocked ? (
        <div>
          <p className="text-gray-600 mb-2">Unlock for ₹{listing.unlockPrice} to view contact details.</p>
          <button onClick={handleUnlock} className="bg-blue-600 text-white px-4 py-2 rounded">
            Unlock Contact Info
          </button>
        </div>
      ) : (
        <div className="bg-green-100 p-4 rounded mt-4">
          <p><strong>Seller Phone:</strong> {listing.sellerInfo.phone}</p>
          <p><strong>Seller Address:</strong> {listing.sellerInfo.address}</p>
        </div>
      )}
    </div>
  );
}
