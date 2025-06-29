import { useState } from 'react';
import axios from 'axios';

const companies = ['JCB', 'CAT', 'Hitachi', 'Komatsu'];
const vehicleTypes = ['Excavator', 'Backhoe Loader', 'Dozer', 'Grader'];
const machineOptions = {
  JCB: ['3DX', '430ZX'],
  CAT: ['320D', '420F'],
  Hitachi: ['EX200', 'ZX210'],
  Komatsu: ['PC210', 'D85ESS']
};

const AddListing = () => {
  const [formData, setFormData] = useState({
    title: '', vehicleType: '', company: '', machineType: '', price: '',
    location: '', contactNumber: '', specs: '', ownerName: '', contactAddress: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCompanyChange = e => setFormData({ ...formData, company: e.target.value, machineType: '' });
  const handleImageChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (imageFile) data.append('image', imageFile);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/listings`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Listing added successfully!');
      setFormData({
        title: '', vehicleType: '', company: '', machineType: '', price: '',
        location: '', contactNumber: '', specs: '', ownerName: '', contactAddress: ''
      });
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error('Error adding listing:', err);
      alert('Failed to add listing.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Vehicle Listing</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fields */}
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="input" required />
        <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="input" required>
          <option value="">Vehicle Type</option>{vehicleTypes.map(t => <option key={t}>{t}</option>)}
        </select>
        <select name="company" value={formData.company} onChange={handleCompanyChange} className="input" required>
          <option value="">Company</option>{companies.map(c => <option key={c}>{c}</option>)}
        </select>
        <select name="machineType" value={formData.machineType} onChange={handleChange} className="input" required disabled={!formData.company}>
          <option value="">Machine Type</option>{(machineOptions[formData.company] || []).map(m => <option key={m}>{m}</option>)}
        </select>
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="input" required />
        <input name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} className="input" required />
        <input name="ownerName" placeholder="Owner Name" value={formData.ownerName} onChange={handleChange} className="input" />
        <input name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="input" required />
        <input name="contactAddress" placeholder="Contact Address" value={formData.contactAddress} onChange={handleChange} className="input" />
        <textarea name="specs" placeholder="Specs / Description" value={formData.specs} onChange={handleChange} className="input md:col-span-2" rows="3" />

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange}
            className="block w-full border px-3 py-2 rounded" required />
          {preview && <img src={preview} alt="preview" className="mt-4 h-48 rounded object-cover" />}
        </div>

        <button type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Add Listing</button>
      </form>
    </div>
  );
};

export default AddListing;
