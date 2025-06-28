import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    vehicleType: '',
    company: '',
    machineType: '',
    price: '',
    location: '',
    image: '',
    contactNumber: ''
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        alert('Failed to load listing.');
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, formData);
      alert('Listing updated successfully!');
      navigate('/admin/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Failed to update listing.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Vehicle Listing</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="input" required />
        <input name="vehicleType" placeholder="Vehicle Type" value={formData.vehicleType} onChange={handleChange} className="input" required />
        <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} className="input" required />
        <input name="machineType" placeholder="Machine Type" value={formData.machineType} onChange={handleChange} className="input" required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="input" required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="input" required />
        <input name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="input" required />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="input" required />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2">
          Update Listing
        </button>
      </form>
    </div>
  );
};

export default EditListing;
