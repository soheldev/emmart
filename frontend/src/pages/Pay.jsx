import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Pay = () => {
  const { id } = useParams(); // listingId
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        setListing(res.data?.data);
      } catch (err) {
        console.error('Failed to fetch listing:', err);
      }
    };
    fetchListing();
  }, [id]);

  const handlePayment = async () => {
    if (!buyerName || !buyerPhone) {
      alert('Enter your name and phone number');
      return;
    }

    try {
      // Step 1: Create order on server
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/initiate`, {
        listingId: id,
        buyerName,
        buyerPhone,
        amount: listing.price,
      });

      const { orderId, key } = res.data;

      // Step 2: Open Razorpay widget
      const options = {
        key,
        amount: listing.price * 100,
        currency: 'INR',
        name: 'Emmart',
        description: listing.title,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
              listingId: id,
              buyerName,
              buyerPhone,
              amount: listing.price,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            alert('Payment successful!');
            navigate('/');
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment failed');
          }
        },
        prefill: {
          name: buyerName,
          contact: buyerPhone,
        },
        theme: {
          color: '#1E40AF',
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error('Payment init error:', err);
      alert('Payment setup failed');
    }
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{listing.title}</h2>
      <img
        src={listing.images?.[0] || 'https://via.placeholder.com/400'}
        className="w-full h-52 object-cover rounded mb-4"
        alt={listing.title}
      />
      <p><strong>Brand:</strong> {listing.brand}</p>
      <p><strong>Type:</strong> {listing.machineType}</p>
      <p><strong>Location:</strong> {listing.location}</p>
      <p className="text-green-600 font-bold text-lg mt-2">₹{listing.price}</p>

      <div className="mt-6 space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-2 rounded"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
          value={buyerPhone}
          onChange={(e) => setBuyerPhone(e.target.value)}
        />
        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Pay ₹{listing.price}
        </button>
      </div>
    </div>
  );
};

export default Pay;
