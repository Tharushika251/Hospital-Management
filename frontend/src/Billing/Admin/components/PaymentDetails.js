import React, { useEffect } from 'react';

const PaymentDetails = ({
  paymentMethod,
  setPaymentMethod,
  paidAmount,
  setPaidAmount,
  balanceAmount,
  insuranceProvider,
  setInsuranceProvider,
  policyNumber,
  setPolicyNumber,
  paidStatus,
  setPaidStatus,
}) => {

  useEffect(() => {
    if (balanceAmount === 0) {
      setPaidStatus('paid'); // Automatically set to "Confirm" when balance is 0
    } else {
      setPaidStatus('unPaid');
    }
  }, [balanceAmount, setPaidStatus]); 

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700">Payment Method:</label>
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Insurance">Insurance</option>
        </select>
      </div>

      {paymentMethod === 'Insurance' && (
        <>
          <div>
            <label className="block text-gray-700">Insurance Provider:</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Policy Number:</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            />
          </div>
        </>
      )}

      {paymentMethod === 'Cash' && (
        <>
          <div>
            <label className="block text-gray-700">Paid Amount:</label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded no-spinner"
              value={paidAmount}
              onChange={(e) => {
                let value = e.target.value;
                // Remove leading zeros if it's not a decimal number (0.25 is allowed, 001 will be converted to 1)
                if (
                  value.startsWith('0') &&
                  !value.startsWith('0.') &&
                  value.length > 1
                ) {
                  value = value.replace(/^0+/, '');
                }
                setPaidAmount(value);
              }}
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-gray-700">Balance Amount: </label>
            <span className="text-red-600 font-bold">
              Rs.{' '}
              {balanceAmount.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </>
      )}

      <div>
        <label className="block text-gray-700">Payment Status:</label>
        <select
          className="block w-full px-3 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-300"
          value={paidStatus}
          onChange={(e) => setPaidStatus(e.target.value)}
        >
          <option value="unPaid">Pending</option>
          <option value="paid">Confirm</option>
        </select>
      </div>
    </div>
  );
};

export default PaymentDetails;
