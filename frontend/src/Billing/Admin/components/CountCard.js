import {
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaMoneyCheckAlt,
} from 'react-icons/fa';

export default function CountCard({ bills }) {
  // Calculate totals
  const totalAmount = bills.reduce(
    (acc, bill) => acc + Number(bill.totalAmount),
    0
  );
  const totalPaid = bills.reduce(
    (acc, bill) => acc + Number(bill.paidAmount),
    0
  );
  const totalBalance = bills.reduce(
    (acc, bill) => acc + Number(bill.balanceAmount),
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-300">
        <FaMoneyBillWave className="text-blue-500 mr-3" size={30} />
        <div>
          <h4 className="text-lg font-semibold">Total Amount</h4>
          <p className="text-gray-600">Rs. {totalAmount.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-300">
        <FaHandHoldingUsd className="text-green-500 mr-3" size={30} />
        <div>
          <h4 className="text-lg font-semibold">Total Paid</h4>
          <p className="text-gray-600">Rs. {totalPaid.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-300">
        <FaMoneyCheckAlt className="text-red-500 mr-3" size={30} />
        <div>
          <h4 className="text-lg font-semibold">Total Balance</h4>
          <p className="text-gray-600">Rs. {totalBalance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
