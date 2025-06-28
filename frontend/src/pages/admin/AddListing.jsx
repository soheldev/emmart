import { useState } from 'react';
import axios from 'axios';

const AddListing = () => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/listings`, formData);
      alert('Listing added successfully!');
      setFormData({
        title: '',
        vehicleType: '',
        company: '',
        machineType: '',
        price: '',
        location: '',
        image: '',
        contactNumber: ''
      });
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to add listing.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Vehicle Listing</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="input" required />
        <input name="vehicleType" placeholder="Vehicle Type (e.g., Excavator)" value={formData.vehicleType} onChange={handleChange} className="input" required />
        <input name="company" placeholder="Company (e.g., JCB)" value={formData.company} onChange={handleChange} className="input" required />
        <input name="machineType" placeholder="Machine Type (e.g., Backhoe)" value={formData.machineType} onChange={handleChange} className="input" required />
        <input name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} className="input" required />
        <input name="location" placeholder="Location (City)" value={formData.location} onChange={handleChange} className="input" required />
        <input name="contactNumber" placeholder="Owner Contact Number" value={formData.contactNumber} onChange={handleChange} className="input" required />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="input" required />
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2">
          Add Listing
        </button>
      </form>
    </div>
  );
};

export default AddListing;
