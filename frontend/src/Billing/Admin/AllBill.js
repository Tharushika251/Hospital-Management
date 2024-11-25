import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllBill, deleteBill } from '../../services/BillingAPI';
import EditBillModal from './components/EditBillModal';
import CountCard from './components/CountCard';
import AdminNav from '../../Navbar/Admin/AdminNav';
import PaymentHistory from './components/PaymentHistory';
import BillHistoryList from './components/BillHistoryList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllBill() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [activeTab, setActiveTab] = useState('bills'); // Add activeTab state for tab navigation

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllBill();
      setBills(response.data);
      setFilteredBills(response.data);
    } catch (err) {
      setError('Failed to fetch bills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      await deleteBill(id);
      toast.success('Bill Delete successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setBills(bills.filter((bill) => bill._id !== id));
      setFilteredBills(filteredBills.filter((bill) => bill._id !== id));
    } catch (err) {
      setError('Failed to delete the bill.');
    }
  };

  const editBill = (bill) => {
    setIsEditing(true);
    setEditingBill(bill);
  };

  const updateBill = async (id, updatedBill) => {
    try {
      await axios.put(`http://localhost:8500/bills/update/${id}`, updatedBill);
      setBills(bills.map((bill) => (bill._id === id ? updatedBill : bill)));
      setFilteredBills(
        filteredBills.map((bill) => (bill._id === id ? updatedBill : bill))
      );
      setIsEditing(false);
            toast.success('Bill Update successfully!', {
              position: 'top-right',
              autoClose: 3000,
            });
      setEditingBill(null);
    } catch (err) {
      setError('Failed to update the bill.');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredBills(bills);
    } else {
      setFilteredBills(
        bills.filter(
          (bill) =>
            bill.patientName.toLowerCase().includes(term) ||
            bill.appointmentID.toLowerCase().includes(term)
        )
      );
    }
  };

  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) return <div className="text-red-500 mt-4">{error}</div>;

  return (
    <>
      <AdminNav />
      <div className="container mx-auto mt-8 pt-20 pl-48">
        {/* Tabs for Bills and Payment History */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('bills')}
            className={`px-6 py-2 text-sm font-medium rounded-t-lg transition-colors duration-300 ease-in-out shadow ${
              activeTab === 'bills'
                ? 'bg-purple-600 text-white border-b-2 border-purple-600'
                : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
            }`}
          >
            Bills
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`ml-4 px-6 py-2 text-sm font-medium rounded-t-lg transition-colors duration-300 ease-in-out shadow ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white border-b-2 border-purple-600'
                : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
            }`}
          >
            Payment History
          </button>
        </div>

        {activeTab === 'bills' && (
          <>
            {/* Totals Cards */}
            <CountCard bills={bills} />

            <BillHistoryList
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              currentBills={currentBills}
              filteredBills={filteredBills}
              editBill={editBill}
              handleDeleteBill={handleDeleteBill}
              billsPerPage={billsPerPage}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        )}

        {/* Payment History Tab Content */}
        {activeTab === 'history' && <PaymentHistory />}

        {/* Edit Bill Modal */}
        {isEditing && (
          <EditBillModal
            bill={editingBill}
            onClose={() => setIsEditing(false)}
            onUpdate={updateBill}
          />
        )}
      </div>

      <ToastContainer />
    </>
  );
}

export default AllBill;
