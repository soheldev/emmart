import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import Listings from '../pages/admin/Listings';
import AddListing from '../pages/admin/AddListing';
import EditListing from '../pages/admin/EditListing';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/listings" element={<Listings />} />
      <Route path="/admin/add" element={<AddListing />} />
      <Route path="/admin/edit/:id" element={<EditListing />} />
    </Routes>
  );
}
