import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    brand: '',
    machineType: '',
    location: '',
    specs: '',
    price: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      await axios.post('/api/admin/listings', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Listing added successfully');
      navigate('/admin/listings');
    } catch (err) {
      console.error(err);
      alert('Failed to add listing');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'brand', 'machineType', 'location', 'specs', 'price'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Listing
        </button>
      </form>
    </div>
  );
};

export default AddListing;
