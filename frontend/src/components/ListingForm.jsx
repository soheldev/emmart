import { useState } from 'react';
import axios from 'axios';

function ListingForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    brand: '',
    machineType: '',
    location: '',
    price: '',
    specs: '',
    ownerName: '',
    contactNumber: '',
    contactAddress: '',
    images: [''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleAddImage = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/listings`, form);
      alert('Listing added!');
      setForm({
        title: '',
        brand: '',
        machineType: '',
        location: '',
        price: '',
        specs: '',
        ownerName: '',
        contactNumber: '',
        contactAddress: '',
        images: [''],
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to add listing:', err);
      alert('Error adding listing.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-bold">Add New Listing</h2>

      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="machineType" placeholder="Machine Type" value={form.machineType} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" required />
      <textarea name="specs" placeholder="Specs" value={form.specs} onChange={handleChange} className="w-full border p-2 rounded" />

      <hr />

      <input name="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="contactAddress" placeholder="Contact Address" value={form.contactAddress} onChange={handleChange} className="w-full border p-2 rounded" />

      <hr />

      <div>
        <label className="font-semibold">Image URLs:</label>
        {form.images.map((img, index) => (
          <input
            key={index}
            placeholder={`Image ${index + 1}`}
            value={img}
            onChange={(e) => handleImageChange(index, e.target.value)}
            className="w-full border p-2 rounded mb-1"
          />
        ))}
        <button type="button" onClick={handleAddImage} className="text-blue-600 underline text-sm">+ Add Image</button>
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Listing</button>
    </form>
  );
}

export default ListingForm;

