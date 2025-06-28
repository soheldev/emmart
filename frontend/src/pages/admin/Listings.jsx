import { useNavigate } from 'react-router-dom';

const Listings = () => {
  const navigate = useNavigate();

  // Dummy listings array for layout testing
  const listings = [
    {
      id: 1,
      title: 'CAT 320D Excavator',
      type: 'Excavator',
      company: 'CAT',
      price: '₹28,00,000',
    },
    {
      id: 2,
      title: 'JCB 3DX Backhoe Loader',
      type: 'Backhoe Loader',
      company: 'JCB',
      price: '₹18,50,000',
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Listings</h2>
        <button
          onClick={() => navigate('/admin/listings/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Listing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="border rounded shadow-sm p-4 bg-white flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{listing.title}</h3>
              <p className="text-sm">Type: {listing.type}</p>
              <p className="text-sm">Company: {listing.company}</p>
              <p className="text-sm">Price: {listing.price}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate(`/admin/listings/edit/${listing.id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
