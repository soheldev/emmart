import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Hitachi: ['Excavators', 'Loaders'],
};

export default function EditListing() {
  const { id } = useParams();
  const nav = useNavigate();

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
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    api.get(`/admin/listings/${id}`).then((res) => {
      const data = res.data.data;
      setForm({
        title: data.title,
        price: data.price,
        location: data.location,
        specs: data.specs,
        unlockPrice: data.unlockPrice,
        sellerPhone: data.sellerInfo.phone,
        sellerAddress: data.sellerInfo.address,
        brand: data.brand || '',
        machineType: data.machineType || '',
      });
      setExistingImages(data.images || []);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'brand' ? { machineType: '' } : {}),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      alert('Only 6 images allowed');
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
      await api.put(`/admin/listings/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Listing updated');
      nav('/listings');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Edit Vehicle Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border" required />
        <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price" className="w-full p-2 border" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border" required />
        <textarea name="specs" value={form.specs} onChange={handleChange} rows={3} placeholder="Specifications" className="w-full p-2 border" />

        <select name="brand" value={form.brand} onChange={handleChange} className="w-full p-2 border" required>
          <option value="">Select Brand</option>
          {Object.keys(brandMachineMap).map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        {form.brand && (
          <select name="machineType" value={form.machineType} onChange={handleChange} className="w-full p-2 border" required>
            <option value="">Select Machine Type</option>
            {brandMachineMap[form.brand].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        )}

        <input name="unlockPrice" value={form.unlockPrice} onChange={handleChange} type="number" placeholder="Unlock Price" className="w-full p-2 border" />
        <input name="sellerPhone" value={form.sellerPhone} onChange={handleChange} placeholder="Seller Phone" className="w-full p-2 border" required />
        <input name="sellerAddress" value={form.sellerAddress} onChange={handleChange} placeholder="Seller Address" className="w-full p-2 border" required />

        <div>
          <label className="block mb-1">Replace Images (Max 6)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full border p-2" />
        </div>

        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {existingImages.map((img, i) => (
              <img key={i} src={img} alt={`img${i}`} className="w-full h-24 object-cover rounded" />
            ))}
          </div>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
}
