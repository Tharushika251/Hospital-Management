import React, { useEffect, useState } from 'react';
import validator from 'validator';
import UserNav from '../../Navbar/User/UserNav';
import { useLocation } from 'react-router-dom';
import { addpayment, updateBill } from '../../services/BillingAPI';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const { billId, amounts } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState('');
  const [email, setEmail] = useState('testuser@example.com');
  const [amount, setAmount] = useState(amounts || 0);
  const [cardNumber, setCardNumber] = useState('4111111111111111');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cvv, setCvv] = useState('123');
  const [name, setName] = useState('John Doe');
  const [slip, setSlip] = useState(null);
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  useEffect(() => {
    if (amounts) {
      setAmount(amounts);
    }
  }, [amounts]);

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setErrors(''); // Reset errors on method change
  };

  const validateFields = () => {
    let validationErrors = '';

    if (selectedMethod === 'card') {
      if (!validator.isEmail(email)) {
        validationErrors = 'Please enter a valid email.';
      } else if (!validator.isLength(cardNumber, { min: 16, max: 16 })) {
        validationErrors = 'Card number must be 16 digits.';
      } else if (!validator.isLength(expiryDate, { min: 5, max: 5 })) {
        validationErrors = 'Expiry date must be in MM/YY format.';
      } else if (!validator.isLength(cvv, { min: 3, max: 3 })) {
        validationErrors = 'CVV must be 3 digit.';
      } else if (!validator.isNumeric(cvv)) {
        validationErrors = 'CVV must be 3 digits.';
      } else if (!name) {
        validationErrors = 'Please enter the cardholder name.';
      }
    } else if (selectedMethod === 'offline' && !slip) {
      validationErrors = 'Please upload a payment slip.';
    }

    setErrors(validationErrors);
    return !validationErrors;
  };

  const handlePayment = async () => {
    if (!validateFields()) return;

    const paymentData = {
      billId,
      userId,
      method: selectedMethod,
      email,
      amount,
      slip, // Include slip data
    };

    try {
      const response = await addpayment(paymentData);
      if (response.status) {
        console.log('Payment status updated:', response.data);
        alert('Payment Successful');
      }

      if (selectedMethod === 'card') {
        await updateBill(billId, 'paid');
      }

      if (selectedMethod === 'offline') {
        await updateBill(billId, 'pending');
      }

      navigate('/bill');

    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Payment failed, please try again.');
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSlip(reader.result); // Set base64 string
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="min-h-screen bg-blue-100 flex flex-col items-center py-8 px-4">
        <UserNav />

        {selectedMethod === '' && (
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mt-20">
            <h2 className="text-xl font-semibold text-center mb-4">
              Choose A Payment Method
            </h2>
            <div
              onClick={() => handleSelectMethod('card')}
              className="border-t border-b py-4 text-center cursor-pointer"
            >
              Credit / Debit Card
            </div>
            <div
              onClick={() => handleSelectMethod('offline')}
              className="border-b py-4 text-center cursor-pointer"
            >
              Offline/Bank transfer
            </div>
          </div>
        )}

        {selectedMethod === 'card' && (
          <PayCard
            errors={errors}
            email={email}
            setEmail={setEmail}
            amount={amount}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            cvv={cvv}
            setCvv={setCvv}
            name={name}
            setName={setName}
            handlePayment={handlePayment}
            setSelectedMethod={setSelectedMethod}
          />
        )}

        {selectedMethod === 'offline' && (
          <PayOffline
            errors={errors}
            slip={slip} // Pass slip state
            setSlip={setSlip}
            amount={amount}
            handleFileUpload={handleFileUpload} // Pass file upload handler
            handlePayment={handlePayment}
            setSelectedMethod={setSelectedMethod}
          />
        )}
      </div>
    </>
  );
};

export default PaymentPage;

function PayOffline({
  errors,
  slip,
  setSlip,
  amount,
  handleFileUpload,
  handlePayment,
  setSelectedMethod,
}) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mt-20">
      <h2 className="text-xl font-semibold text-center mb-4">
        Upload Payment Slip
      </h2>

      {errors && <p className="text-red-500 mb-4">{errors}</p>}

      {/* Dummy Bank Details Section */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Bank Details:
        </h3>
        <p className="text-gray-700">
          Bank Name: <span className="font-medium">Dummy Bank</span>
        </p>
        <p className="text-gray-700">
          Account Name: <span className="font-medium">Dummy Account</span>
        </p>
        <p className="text-gray-700">
          Account Number: <span className="font-medium">123456789</span>
        </p>
        <p className="text-gray-700">
          Branch Name & Code: <span className="font-medium">DUMMY1234</span>
        </p>
        <p className="text-gray-700">
          Amount:{' '}
          <span className="font-semibold text-blue-600">Rs. {amount}.00</span>
        </p>
      </div>

      <div
        className="border-dashed border-4 border-gray-300 p-4 text-center cursor-pointer mb-10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('fileInput').click()} // Trigger file input on click
      >
        {slip ? (
          <img
            src={slip}
            alt="Slip preview"
            className="mx-auto mb-4 w-full h-48 object-contain"
          />
        ) : (
          <p>Drag and drop the payment slip here or click to upload</p>
        )}

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          className="hidden" // Hidden file input
        />
      </div>

      <button
        type="button"
        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        onClick={handlePayment}
      >
        Pay Bill
      </button>
      <button
        type="button"
        className="w-full bg-gray-300 text-gray-700 py-2 rounded-md mt-4 hover:bg-gray-400 transition"
        onClick={() => setSelectedMethod('')}
      >
        Cancel
      </button>
    </div>
  );
}

function PayCard({
  errors,
  email,
  setEmail,
  amount,
  cardNumber,
  setCardNumber,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  name,
  setName,
  handlePayment,
  setSelectedMethod,
}) {
  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mt-20 mb-20">
      <h2 className="text-xl font-semibold text-center mb-4">Pay with Card</h2>
      {errors && <p className="text-red-500 mb-4">{errors}</p>}
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            className="w-full px-3 py-2 border rounded-md focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount</label>
          <input
            type="text"
            value={`Rs. ${amount}`}
            className="w-full px-3 py-2 border rounded-md focus:outline-none"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Card Information</label>
          <input
            type="text"
            placeholder="Card Number"
            className="w-full px-3 py-2 border rounded-md focus:outline-none"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="MM/YY"
            className="w-1/2 px-3 py-2 border rounded-md focus:outline-none"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-1/2 px-3 py-2 border rounded-md focus:outline-none"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
          onClick={handlePayment}
        >
          Pay Bill
        </button>
        <button
          type="button"
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-md mt-4 hover:bg-gray-400 transition"
          onClick={() => setSelectedMethod('')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
