import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  getpaymentHistory,
  paymentApproved,
  updateBill,
} from '../../../services/BillingAPI';
import PaymentReport from './PaymentReport'; // Adjust the import based on your file structure
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // State to control report modal visibility
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch payment history data on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getpaymentHistory();
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPayments();
  }, []);

  // Handle approve or reject action
  const handlePaymentStatus = async (id, status, billId) => {
    try {
      await paymentApproved(id, status);

      if (status === 'approved') {
        console.log(billId);
        await updateBill(billId, 'paid');
      }

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === id ? { ...payment, status } : payment
        )
      );
      setIsModalOpen(false);

      toast.success('Update successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error(`Error updating payment status to ${status}:`, error);
    }
  };

  // Open modal and set selected payment
  const handleViewSlip = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  // Filter payments by date range
  const filteredPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.date);
    if (startDate && endDate) {
      return paymentDate >= startDate && paymentDate <= endDate;
    }
    return true; // No filtering if dates are not selected
  });

  // Clear date filters
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="bg-gray-50 p-8 rounded-md">
      <ToastContainer />
      <h3 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
        Payment History
      </h3>
      {/* Date range filter */}
      <div className="mb-4 flex items-center justify-center align-center space-x-4">
        <div className="flex flex-col items-center">
          <label className="block text-gray-600">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholderText="Select start date"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="block text-gray-600">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholderText="Select end date"
          />
        </div>
        <button
          onClick={clearFilters}
          className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md mt-6"
        >
          Clear Filter
        </button>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md mt-6"
        >
          Show Report
        </button>
      </div>
      <div className="overflow-x-auto">
        {/* Payment History Table */}
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-4 px-6 text-gray-600 font-medium">
                Payment Date
              </th>
              <th className="py-4 px-6 text-gray-600 font-medium">
                Patient Email
              </th>
              <th className="py-4 px-6 text-gray-600 font-medium">Amount</th>
              <th className="py-4 px-6 text-gray-600 font-medium">Method</th>
              <th className="py-4 px-6 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr
                key={payment._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-6">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">{payment.email || 'Unknown'}</td>
                <td className="py-4 px-6">Rs. {payment.amount.toFixed(2)}</td>
                <td className="py-4 px-6">
                  {payment.method === 'offline' ? 'Offline' : 'Online'}
                </td>
                <td className="py-4 px-6">
                  {payment.method === 'offline' &&
                  payment.status === 'pending' ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewSlip(payment)}
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        View Slip
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`${
                        payment.status === 'approved'
                          ? 'text-green-500'
                          : payment.status === 'rejected'
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing slip and approving/rejecting */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-96">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-xl font-semibold mb-4 text-gray-700">
              Payment Slip
            </h4>
            <img
              src={selectedPayment.slip}
              alt="Payment Slip"
              className="w-full h-auto mb-4"
            />
            <div className="flex justify-between">
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                onClick={() =>
                  handlePaymentStatus(
                    selectedPayment._id,
                    'approved',
                    selectedPayment.billId
                  )
                }
              >
                Approve
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                onClick={() =>
                  handlePaymentStatus(
                    selectedPayment._id,
                    'rejected',
                    selectedPayment.billId
                  )
                }
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for Payment Report */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-4xl bg-white p-8 rounded-lg shadow-lg relative ">
            <button
              className="absolute size-8 text-3xl top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => setIsReportModalOpen(false)}
            >
              &times;
            </button>
            <h4 className="text-xl font-semibold mb-4 text-gray-700">
              Payment Report
            </h4>
            <PaymentReport payment={payments} />{' '}
            {/* Include the PaymentReport component */}
          </div>
        </div>
      )}
    </div>
  );
}
