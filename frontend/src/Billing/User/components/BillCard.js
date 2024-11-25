import { FaEye } from 'react-icons/fa';

export default function BillCard({ bill, navigate }) {
  return (
    <div className="space-y-4">
      {bill.map((bill) => (
        <div
          key={bill._id}
          className="flex justify-between items-center bg-white shadow rounded-lg p-4"
        >
          <div>
            <p className="font-semibold">
              Appoinment Number : {bill.appointmentID}
            </p>
            <p className="text-lg font-semibold">
              Balance: Rs. {bill.balanceAmount.toFixed(2)}
            </p>
            <p className="text-sm">Payment Status: {bill.paidStatus}</p>
            <p className="text-sm text-gray-500">
              {new Date(bill.issuedDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Button to navigate to bill details */}
          <button
            onClick={() => navigate(`/billDetails/${bill._id}`)}
            className="p-2 bg-purple-500 text-white rounded-full"
          >
            <FaEye />
          </button>
        </div>
      ))}
    </div>
  );
}
