import { FaSearch } from 'react-icons/fa';
import BillCard from './BillCard';

export default function OutstandingBills({ searchQuery, setSearchQuery, bill, navigate }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">Outstanding Bills</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-md p-2 flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="ml-2 p-2 bg-gray-900 text-white rounded-md">
          <FaSearch />
        </button>
      </div>
      <BillCard   bill={bill} navigate={navigate}  />
    </div>
  );
}

  