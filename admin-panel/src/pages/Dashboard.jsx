import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(() => alert('Failed to load stats'));
  }, []);

  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded shadow">
          <p className="text-sm">Total Listings</p>
          <p className="text-2xl font-bold">{stats.totalListings}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded shadow">
          <p className="text-sm">Total Payments</p>
          <p className="text-2xl font-bold">{stats.totalPayments}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <p className="text-sm">Total Revenue (₹)</p>
          <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded shadow">
          <p className="text-sm">Revenue This Month (₹)</p>
          <p className="text-2xl font-bold">₹{stats.monthlyRevenue}</p>
        </div>
      </div>
    </div>
  );
}
