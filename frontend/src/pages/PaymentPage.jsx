import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PaymentPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [buyer, setBuyer] = useState({ name: '', phone: '' });
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        setListing(res.data.data);
      } catch (err) {
        alert('Listing not found');
      }
    };
    fetchListing();
  }, []);

  const handlePay = async () => {
    if (!buyer.name || !buyer.phone) {
      return alert('Enter name and phone to continue');
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/initiate`, {
        listingId: id,
        buyerName: buyer.name,
        buyerPhone: buyer.phone,
      });

      const { orderId, amount } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Emmart',
        description: 'Contact Info Access',
        order_id: orderId,
        handler: async (response) => {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
            ...response,
            listingId: id,
          });

          setPaymentStatus('success');
        },
        prefill: {
          name: buyer.name,
          contact: buyer.phone,
        },
        theme: { color: '#3399cc' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed');
    }
  };

  if (!listing) return <div className="p-6">Loading...</div>;
  if (paymentStatus === 'success') {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Payment Successful!</h2>
        <p className="mb-2">You can now contact the seller directly:</p>
        <p className="font-semibold">Phone: {listing.ownerPhone || 'XXXXXXXXXX'}</p>
        <p className="font-semibold">Name: {listing.ownerName || 'Owner'}</p>
        <a href="/" className="text-blue-600 underline mt-4 block">Go back to Home</a>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pay ₹{listing.price} to Access Contact Info</h2>
      <input
        type="text"
        placeholder="Your Name"
        className="w-full border px-3 py-2 rounded mb-2"
        value={buyer.name}
        onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full border px-3 py-2 rounded mb-4"
        value={buyer.phone}
        onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
      />
      <button
        onClick={handlePay}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Pay with UPI
      </button>
    </div>
  );
}

export default PaymentPage;
