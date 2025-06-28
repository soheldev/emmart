import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const brandMachineMap = {
  JCB: ['Backhoe Loader', 'Excavator', 'Compactor', 'Skid Steer'],
  CAT: ['Excavator', 'Bulldozer', 'Wheel Loader', 'Grader', 'Compactor'],
  Komatsu: ['Excavator', 'Bulldozer', 'Wheel Loader', 'Motor Grader'],
  "TATA Hitachi": ['Excavator', 'Backhoe Loader', 'Wheel Loader'],
  Volvo: ['Excavator', 'Wheel Loader', 'Compactor', 'Hauler'],
  Hyundai: ['Excavator', 'Wheel Loader'],
  BEML: ['Bulldozer', 'Motor Grader', 'Dump Truck', 'Loader'],
  CASE: ['Backhoe Loader', 'Grader', 'Compactor', 'Dozer'],
  "L&T": ['Excavator', 'Compactor', 'Loader'],
  Doosan: ['Excavator', 'Wheel Loader'],
  Liebherr: ['Excavator', 'Dozer', 'Loader'],
  "Mahindra Construction": ['Backhoe Loader', 'EarthMaster'],
  Escorts: ['Compactor', 'Cranes', 'Backhoe Loaders'],
  SANY: ['Excavator', 'Piling Rig', 'Crane'],
  XCMG: ['Excavator', 'Grader', 'Loader'],
  Terex: ['Backhoe Loader', 'Skid Steer', 'Dumper'],
  Manitou: ['Telehandler', 'Skid Steer'],
  Bobcat: ['Skid Steer Loader', 'Mini Excavator'],
  "New Holland": ['Backhoe Loader', 'Skid Steer'],
  Hitachi: ['Excavators', 'Loaders']
};

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    brand: '', machineType: '', location: '', search: ''
  });
  const nav = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const query = new URLSearchParams(
        Object.entries(filters)
          .filter(([_, v]) => v.trim())
      ).toString();

      const res = await api.get(`/listings?${query}`);
      setListings(res.data.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Browse Earthmovers for Sale</h1>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-sm block mb-1">Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value, machineType: '' })}
            className="border p-2 w-full"
          >
            <option value="">All Brands</option>
            {Object.keys(brandMachineMap).map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">Machine Type</label>
          <select
            value={filters.machineType}
            onChange={(e) => setFilters({ ...filters, machineType: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="">All Machines</option>
            {(brandMachineMap[filters.brand] || []).map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">Location</label>
          <input
            type="text"
            placeholder="e.g. Pune"
            className="border p-2 w-full"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Search</label>
          <input
            type="text"
            placeholder="Keyword..."
            className="border p-2 w-full"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      {/* 📋 Listings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div key={item._id} className="border rounded shadow p-4">
            {item.images?.[0] && (
              <img
                src={item.images[0]}
                alt={item.title}
                className="h-40 w-full object-cover rounded mb-3"
              />
            )}
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.brand} | {item.machineType}</p>
            <p className="text-sm text-gray-500">📍 {item.location}</p>
            <p className="mt-2 font-bold text-blue-800">₹{item.price}</p>
            <button
              onClick={() => nav(`/listing/${item._id}`)}
              className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <p className="text-center mt-10 text-gray-500">No listings found. Try changing filters.</p>
      )}
    </div>
  );
}
