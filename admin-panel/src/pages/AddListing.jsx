import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const brandMachineMap = {
  JCB: ['Backhoe Loader', 'Excavator', 'Compactor', 'Skid Steer'],
  CAT: ['Excavator', 'Bulldozer', 'Wheel Loader', 'Grader', 'Compactor'],
  Komatsu: ['Excavator', 'Bulldozer', 'Wheel Loader', 'Motor Grader'],
  "TATA Hitachi": ['Excavator', 'Backhoe Loader', 'Wheel Loader'],
  Volvo: ['Excavator', 'Wheel Loader', 'Compactor', 'Hauler'],
  Hyundai: ['Excavator', 'Wheel Loader'],
  BEML: ['Bulldozer', 'Motor Grader', 'Dump Truck', 'Loader'],
  CASE: ['Backhoe Loader', 'Grader', 'Compactor', 'Dozer'],
  "L&T": ['Excavator', 'Compactor', 'Loader'],
  Doosan: ['Excavator', 'Wheel Loader'],
  Liebherr: ['Excavator', 'Dozer', 'Loader'],
  "Mahindra Construction": ['Backhoe Loader', 'EarthMaster'],
  Escorts: ['Compactor', 'Cranes', 'Backhoe Loaders'],
  SANY: ['Excavator', 'Piling Rig', 'Crane'],
  XCMG: ['Excavator', 'Grader', 'Loader'],
  Terex: ['Backhoe Loader', 'Skid Steer', 'Dumper'],
  Manitou: ['Telehandler', 'Skid Steer'],
  Bobcat: ['Skid Steer Loader', 'Mini Excavator'],
  "New Holland": ['Backhoe Loader', 'Skid Steer'],
  Hitachi: ['Excavators', 'Loaders']
};

export default function AddListing() {
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    specs: '',
    unlockPrice: 99,
    sellerPhone: '',
    sellerAddress: '',
    brand: '',
    machineType: '',
  });
  const [images, setImages] = useState([]);
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'brand' ? { machineType: '' } : {}) // reset machineType if brand changes
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      alert('Only 6 images allowed.');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.machineType) {
      alert('Brand and Machine Type are required.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    images.forEach((img) => formData.append('images', img));

    try {
      await api.post('/admin/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Listing added!');
      nav('/listings');
    } catch (err) {
      console.error(err);
      alert('Failed to add listing');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Add New Vehicle Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ...title, price, location, specs, etc. */}

        <select
          name="brand"
          className="w-full p-2 border"
          value={form.brand}
          onChange={handleChange}
          required
        >
          <option value="">Select Company</option>
          {Object.keys(brandMachineMap).map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        {form.brand && (
          <select
            name="machineType"
            className="w-full p-2 border"
            value={form.machineType}
            onChange={handleChange}
            required
          >
            <option value="">Select Machine Type</option>
            {brandMachineMap[form.brand].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        )}

        {/* ...seller info + image upload */}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
