import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PublicListing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchListing = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
      setListing(res.data.data);
    } catch (err) {
      console.error(err);
      setListing(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!listing) return <div className="p-6 text-red-600">Listing not found.</div>;

  const imgSrc = listing.images?.[0]
    ? `${import.meta.env.VITE_API_URL}/uploads/${listing.images[0]}`
    : 'https://via.placeholder.com/600x300';

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <img src={imgSrc} className="w-full h-64 object-cover rounded mb-4" />
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-700">{listing.company} • {listing.machineType}</p>
      <p className="text-gray-600 mb-2">Location: {listing.location}</p>
      <p className="mb-4">{listing.specs}</p>
      <p className="text-xl text-green-600 font-bold">₹{listing.price}</p>
      <Link to={`/listing/${id}/pay`} className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">Buy Contact Info</Link>
    </div>
  );
}

export default PublicListing;
