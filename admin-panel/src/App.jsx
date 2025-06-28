import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Listings from './pages/Listings';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import ProtectedRoute from './components/ProtectedRoute';

<a href="/dashboard">Dashboard</a>
<a href="/listings">Listings</a>
<a href="/payments">Payments</a>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<ProtectedRoute><Listings /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
