import { useEffect, useState } from 'react';
import axios from 'axios';
import ListingForm from '../components/ListingForm';

function Listings() {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/listings`);
      setListings(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching admin listings:', err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="p-6">
      <ListingForm onSuccess={fetchListings} />

      <h2 className="text-xl font-bold mt-8 mb-4">All Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((item) => (
          <div key={item._id} className="border rounded shadow p-4">
            <img src={item.images?.[0] || 'https://via.placeholder.com/400'} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm">{item.brand} • {item.machineType}</p>
            <p className="text-sm text-gray-500">{item.location}</p>
            <p className="font-semibold text-green-600">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listings;
