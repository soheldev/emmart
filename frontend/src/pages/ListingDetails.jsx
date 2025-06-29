import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListingDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then(res => {
        if (res.data.data) setListing(res.data.data);
        else throw new Error();
      })
      .catch(() => {
        alert('Listing not found');
        nav('/');
      });
  }, [id]);

  if (!listing) return <p className="p-6">Loading...</p>;

  const imgSrc = listing.images?.[0]
    ? `${import.meta.env.VITE_API_URL}/uploads/${listing.images[0]}`
    : 'https://via.placeholder.com/800x400';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <img src={imgSrc} alt={listing.title} className="w-full h-64 object-cover rounded mb-4" />
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <div className="text-sm flex gap-2 mb-4">
        <span className="px-2 py-1 bg-gray-200 rounded">{listing.company}</span>
        <span className="px-2 py-1 bg-gray-200 rounded">{listing.machineType}</span>
        <span className="px-2 py-1 bg-gray-200 rounded">{listing.location}</span>
      </div>
      <p className="text-lg font-bold text-green-600 mb-2">₹{listing.price}</p>
      <p className="whitespace-pre-line mb-4">{listing.specs}</p>
      <Link to={`/listing/${listing._id}/pay`} className="bg-blue-600 text-white px-4 py-2 rounded">Contact Seller / Buy Now</Link>
    </div>
  );
};

export default ListingDetails;
