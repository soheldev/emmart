import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ListingForm from '../components/ListingForm';

function Listings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/listings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setListings(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching admin listings:', err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const toggleVisibility = async (id, isVisible) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/listings/${id}/visibility`, {
        isVisible: !isVisible
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchListings();
    } catch (err) {
      console.error('Toggle visibility failed', err);
    }
  };

  const deleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchListings();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete listing');
    }
  };

  return (
    <div className="p-6">
      <ListingForm onSuccess={fetchListings} />

      <h2 className="text-xl font-bold mt-8 mb-4">All Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((item) => (
          <div key={item._id} className="border rounded shadow p-4 relative bg-white">
            <img
              src={item.images?.[0] || 'https://via.placeholder.com/400'}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm">{item.brand} • {item.machineType}</p>
            <p className="text-sm text-gray-500">{item.location}</p>
            <p className="font-semibold text-green-600">₹{item.price}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/admin/edit/${item._id}`)}
                className="text-blue-600 underline"
              >
                Edit
              </button>

              <button
                onClick={() => toggleVisibility(item._id, item.isVisible)}
                className={`text-sm px-2 py-1 rounded ${item.isVisible ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'}`}
              >
                {item.isVisible ? 'Hide' : 'Show'}
              </button>

              <button
                onClick={() => deleteListing(item._id)}
                className="text-red-600 underline"
              >
                Delete
              </button>

              <a
                href={`/listing/${item._id}`}
                target="_blank"
                className="text-green-700 underline ml-auto"
              >
                Public View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listings;
