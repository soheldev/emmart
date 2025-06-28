import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import Payments from './pages/Payments';
import PayToView from './pages/PayToView'; // ⬅️ NEW IMPORT
import AddListing from './pages/AddListing';
import ProtectedRoute from './utils/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pay/:id" element={<PayToView />} /> {/* ⬅️ NEW ROUTE */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
	<Route path="/admin/add-listing" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
