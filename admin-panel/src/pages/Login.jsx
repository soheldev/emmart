import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const nav = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', form);
      localStorage.setItem('admin-token', res.data.token);
      nav('/listings');
    } catch (err) {
      alert('Invalid login');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">Admin Login</h2>
        <input name="username" onChange={handleChange} className="w-full p-2 border" placeholder="Username" required />
        <input name="password" onChange={handleChange} type="password" className="w-full p-2 border" placeholder="Password" required />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
