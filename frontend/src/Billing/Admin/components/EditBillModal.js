import React, { useState, useEffect } from 'react';

const EditBillModal = ({ bill, onUpdate, onClose }) => {
  const [patientName, setPatientName] = useState(bill.patientName);
  const [totalAmount, setTotalAmount] = useState(bill.totalAmount);
  const [paidAmount, setPaidAmount] = useState(bill.paidAmount);
  const [balanceAmount, setBalanceAmount] = useState(bill.balanceAmount);
  const [paidStatus, setPaidStatus] = useState(bill.paidStatus);
  const [error, setError] = useState('');

  useEffect(() => {
    // Update balance amount when total or paid amount changes
    const calculatedBalance = Math.max(totalAmount - paidAmount, 0);
    setBalanceAmount(calculatedBalance);

    // Update paid status based on balance amount
    if (calculatedBalance === 0) {
      setPaidStatus('paid');
    } else {
      setPaidStatus('unPaid');
    }
  }, [totalAmount, paidAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Input validation
    if (
      !patientName ||
      totalAmount < 0 ||
      paidAmount < 0 ||
      balanceAmount < 0
    ) {
      setError('Please fill all fields correctly.');
      return;
    }

    const updatedBill = {
      ...bill,
      patientName,
      totalAmount,
      paidAmount,
      balanceAmount,
      paidStatus,
    };

    onUpdate(bill._id, updatedBill);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Edit Bill</h3>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Total Amount</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Paid Amount</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Balance Amount</label>
            <input
              type="number"
              value={balanceAmount}
              readOnly // Make balanceAmount read-only
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Payment Status</label>
            <select
              value={paidStatus}
              onChange={(e) => setPaidStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="paid">Paid</option>
              <option value="unPaid">Unpaid</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBillModal;
