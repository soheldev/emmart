import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchPayments = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (from) params.append('from', from);
    if (to) params.append('to', to);

    api.get(`/admin/payments?${params.toString()}`)
      .then(res => setPayments(res.data))
      .catch(() => alert('Failed to load payments'));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Logs</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone"
          className="border p-2 rounded w-full sm:w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={from}
          onChange={e => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={to}
          onChange={e => setTo(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={fetchPayments}
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Listing</th>
              <th className="p-2 border">Buyer</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{p.listingTitle}</td>
                <td className="p-2 border">{p.buyerName}</td>
                <td className="p-2 border">{p.buyerPhone}</td>
                <td className="p-2 border">₹{p.amount}</td>
                <td className="p-2 border text-green-700 font-medium">{p.status}</td>
                <td className="p-2 border">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
