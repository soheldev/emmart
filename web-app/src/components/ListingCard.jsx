// web-app/src/components/ListingCard.jsx
import { useNavigate } from 'react-router-dom';

export default function ListingCard({ listing }) {
  const nav = useNavigate();

  return (
    <div
      className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => nav(`/listing/${listing._id}`)}
    >
      <img
        src={listing.images?.[0] || '/placeholder.jpg'}
        alt={listing.title}
        className="w-full h-48 object-cover rounded-t"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <p className="text-gray-600">{listing.brand} - {listing.machineType}</p>
        <p className="text-blue-600 font-bold mt-1">₹{listing.price}</p>
        <p className="text-sm text-gray-500">{listing.location}</p>
      </div>
    </div>
  );
}
