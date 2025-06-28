// web-app/src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [machineType, setMachineType] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const allKeywords = Object.entries(brandMachineMap).flatMap(([brand, types]) => [brand, ...types]);
    const filtered = allKeywords.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
    setSuggestions(filtered.slice(0, 6));
  }, [search]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (brand) params.append('brand', brand);
    if (machineType) params.append('machineType', machineType);
    if (search) params.append('search', search);
    nav(`/?${params.toString()}`);
  };

  return (
    <nav className="bg-white shadow p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-xl font-bold text-blue-700">Emmart</h1>

      <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
        <input
          type="text"
          placeholder="Search machine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-48"
        />
        {search && suggestions.length > 0 && (
          <ul className="absolute mt-10 bg-white shadow rounded max-h-40 overflow-y-auto z-10 w-48">
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSearch(item);
                  setSuggestions([]);
                }}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setMachineType('');
          }}
          className="border p-2 rounded"
        >
          <option value="">All Brands</option>
          {Object.keys(brandMachineMap).map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={machineType}
          onChange={(e) => setMachineType(e.target.value)}
          className="border p-2 rounded"
          disabled={!brand}
        >
          <option value="">All Machines</option>
          {(brandMachineMap[brand] || []).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>
    </nav>
  );
}
