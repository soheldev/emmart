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

export default function Listings() {
  const nav = useNavigate();
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    brand: '', machineType: '', location: '', search: ''
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/listings?${query}`);
      setListings(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleVisibility = async (id, current) => {
    try {
      await api.patch(`/admin/listings/${id}/visibility`, { isVisible: !current });
      fetchListings();
    } catch (err) {
      alert('Failed to update visibility');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Vehicle Listings</h2>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value, machineType: '' })}
          className="border p-2"
        >
          <option value="">All Brands</option>
          {Object.keys(brandMachineMap).map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select
          value={filters.machineType}
          onChange={(e) => setFilters({ ...filters, machineType: e.target.value })}
          className="border p-2"
        >
          <option value="">All Machine Types</option>
          {(brandMachineMap[filters.brand] || []).map(m => <option key={m}>{m}</option>)}
        </select>

        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2"
        />
      </div>

      {/* 📋 Listings Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Machine</th>
              <th className="p-2">Price</th>
              <th className="p-2">Location</th>
              <th className="p-2">Visible</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.brand}</td>
                <td className="p-2">{item.machineType}</td>
                <td className="p-2">₹{item.price}</td>
                <td className="p-2">{item.location}</td>
                <td className="p-2">{item.isVisible ? '✅' : '❌'}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => nav(`/edit/${item._id}`)} className="text-blue-600">Edit</button>
                  <button onClick={() => toggleVisibility(item._id, item.isVisible)} className="text-red-600">
                    {item.isVisible ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {listings.length === 0 && <p className="text-center mt-6 text-gray-500">No listings found</p>}
      </div>
    </div>
  );
}
