import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin');

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        {isAdmin && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/listings">Listings</Link>
            <Link to="/admin/payments">Payments</Link>
          </>
        )}
      </div>

      <div>
        {isAdmin ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <Link to="/admin/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
