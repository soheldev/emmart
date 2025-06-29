import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const companies = ['JCB', 'CAT', 'Hitachi', 'Komatsu'];
const vehicleTypes = ['Excavator', 'Backhoe Loader', 'Dozer', 'Grader'];
const machineOptions = {
  JCB: ['3DX', '430ZX'],
  CAT: ['320D', '420F'],
  Hitachi: ['EX200', 'ZX210'],
  Komatsu: ['PC210', 'D85ESS']
};

const EditListing = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    title: '', vehicleType: '', company: '', machineType: '',
    price: '', location: '', contactNumber: '', specs: '',
    ownerName: '', contactAddress: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/listings/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }).then(res => {
      const d = res.data.data;
      setFormData({
        title: d.title || '', vehicleType: d.vehicleType || '',
        company: d.company || '',
        machineType: d.machineType || '',
        price: d.price || '', location: d.location || '',
        contactNumber: d.contactNumber || '',
        specs: d.specs || '',
        ownerName: d.ownerName || '',
        contactAddress: d.contactAddress || ''
      });
      if (d.image) setPreview(`${import.meta.env.VITE_API_URL}/uploads/${d.image}`);
    }).catch(err => {
      console.error(err);
      alert('Failed to load listing');
      nav('/admin/listings');
    });
  }, [id]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCompanyChange = e => setFormData({ ...formData, company: e.target.value, machineType: '' });
  const handleImageChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (imageFile) data.append('image', imageFile);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/listings/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Listing updated!');
      nav('/admin/listings');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Vehicle Listing</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* repeat same fields as AddListing */}
        {/* ... */}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Change Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange}
            className="block w-full border px-3 py-2 rounded" />
          {preview && <img src={preview} alt="preview" className="mt-4 h-48 rounded object-cover" />}
        </div>

        <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Update Listing</button>
      </form>
    </div>
  );
};

export default EditListing;
