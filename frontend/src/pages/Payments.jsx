import { useEffect, useState } from 'react';
import axios from 'axios';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPayments(res.data || []))
      .catch((err) => {
        console.error('Failed to load payments:', err);
        alert('Failed to load payment data');
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Listing</th>
              <th className="p-2">Buyer Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.listingTitle}</td>
                <td className="p-2">{p.buyerName}</td>
                <td className="p-2">{p.buyerPhone}</td>
                <td className="p-2 text-green-600 font-semibold">₹{p.amount}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-2">
                  {new Date(p.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
