import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import PayListing from './pages/PayListing';
import ListingDetails from './pages/ListingDetails';
import Listings from './pages/Listings';
import Pay from './pages/Pay';
import PaymentPage from './pages/PaymentPage';
import PublicListing from './pages/PublicListing';
import Payments from './pages/Payments';
import PayToView from './pages/PayToView';
import AddListing from './pages/AddListing';
import ProtectedRoute from './utils/ProtectedRoute';
import Navbar from './components/Navbar';
import EditListing from './pages/EditListing';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pay/:id" element={<PayToView />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/listing/:id/pay" element={<PaymentPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/listing/:id" element={<PublicListing />} />
        <Route path="/pay/:id" element={<PayListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
        <Route path="/admin/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
        <Route path="/pay/:id" element={<Pay />} />
        <Route path="/admin/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/admin/add-listing" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
