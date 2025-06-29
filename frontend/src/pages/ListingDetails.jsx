import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((res) => {
        if (res.data?.data) {
          setListing(res.data.data);
        } else {
          throw new Error('Not found');
        }
      })
      .catch((err) => {
        console.error('Failed to load listing:', err);
        alert('Listing not found');
        navigate('/');
      });
  }, [id]);

  if (!listing) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={listing.images?.[0] || 'https://via.placeholder.com/800x400'}
        alt={listing.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <div className="text-sm text-gray-600 mb-1">
        <span className="inline-block px-2 py-1 bg-gray-200 rounded mr-2">{listing.brand}</span>
        <span className="inline-block px-2 py-1 bg-gray-200 rounded mr-2">{listing.machineType}</span>
        <span className="inline-block px-2 py-1 bg-gray-200 rounded">{listing.location}</span>
      </div>
      <p className="text-green-600 font-semibold text-lg mt-2 mb-4">₹{listing.price}</p>

      <h2 className="text-lg font-semibold mb-1">Specifications</h2>
      <p className="mb-6 whitespace-pre-line">{listing.specs || 'No additional details provided.'}</p>

      <Link
        to={`/pay/${listing._id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Contact Seller / Buy Now
      </Link>
    </div>
  );
};

export default ListingDetails;
