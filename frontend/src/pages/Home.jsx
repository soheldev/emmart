import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

function Home() {
  const [listings, setListings] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    brand: '',
    machineType: '',
    location: '',
    search: '',
  });

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings`, {
        params: { ...filters },
      });
      setListings(res.data?.data || []);
    } catch (err) {
      console.error('Error loading listings:', err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const handleInputChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Earthmovers</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search title/specs..."
          value={filters.search}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <select
          name="brand"
          value={filters.brand}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">All Brands</option>
          <option value="JCB">JCB</option>
          <option value="Tata Hitachi">Tata Hitachi</option>
          <option value="Caterpillar">Caterpillar</option>
          <option value="Komatsu">Komatsu</option>
        </select>
        <select
          name="machineType"
          value={filters.machineType}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="Excavator">Excavator</option>
          <option value="Backhoe Loader">Backhoe Loader</option>
          <option value="Bulldozer">Bulldozer</option>
          <option value="Motor Grader">Motor Grader</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
      </div>

      {listings.length === 0 && <p>No listings found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((item) => (
          <div key={item._id} className="border rounded shadow-sm p-4">
            <img
              src={item.images?.[0] || 'https://via.placeholder.com/400x300'}
              className="w-full h-48 object-cover rounded mb-2"
              alt={item.title}
            />
            <h2 className="font-semibold text-lg">{item.title}</h2>
            <p className="text-gray-600 text-sm">
              {item.brand} • {item.machineType} • {item.location}
            </p>
            <p className="font-bold text-green-600 mt-1">₹{item.price}</p>
            <Link
              to={`/listing/${item._id}`} // ✅ updated route
              className="block mt-2 text-blue-600 underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
