import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    brand: '',
    machineType: '',
    location: '',
    specs: '',
    price: ''
  });

  const token = localStorage.getItem('adminToken');

  // 🔄 Load existing data
  useEffect(() => {
    axios.get(`/api/listings/${id}`)
      .then(res => {
        const data = res.data.data;
        setForm({
          title: data.title,
          brand: data.brand,
          machineType: data.machineType,
          location: data.location,
          specs: data.specs,
          price: data.price
        });
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load listing data');
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/admin/listings/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Listing updated successfully');
      navigate('/admin/listings');
    } catch (err) {
      console.error(err);
      alert('Failed to update listing');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Listing</h2>
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
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditListing;
