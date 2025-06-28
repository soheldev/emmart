import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PayToView() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then(res => setVehicle(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        amount: 10,
        listingId: id
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Emmart Contact Access",
        description: "Unlock owner phone number",
        order_id: order.id,
        handler: function (response) {
          setPaid(true);
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: { color: "#1d4ed8" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  if (!vehicle) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded-md">
      <h1 className="text-2xl font-semibold mb-4">{vehicle.title}</h1>
      <img src={vehicle.imageUrl} alt="Vehicle" className="w-full h-64 object-cover mb-4 rounded" />
      <p><strong>Type:</strong> {vehicle.type}</p>
      <p><strong>Company:</strong> {vehicle.company}</p>
      <p><strong>Machine:</strong> {vehicle.machine}</p>
      <p><strong>Description:</strong> {vehicle.description}</p>

      <div className="mt-6">
        {paid ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-md">
            <strong>Owner Contact:</strong> {vehicle.contact}
          </div>
        ) : (
          <button
            onClick={handlePayment}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Pay ₹10 to View Contact
          </button>
        )}
      </div>
    </div>
  );
}

export default PayToView;
