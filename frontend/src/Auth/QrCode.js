import React  from 'react';
import Cookies from 'js-cookie';
import UserNav from '../Navbar/User/UserNav';

const QrCode = () => {
    const qrCode = Cookies.get('qrCode');
    const name = Cookies.get('name');

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNav />
      <div className="md:pl-80 md:mt-16 md:pr-28 py-24 px-10 max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome, {name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">Your QR code:</p>
          <div className="flex justify-center items-center">
            <img
              src={qrCode}
              alt="User QR Code"
              className="w-60 h-60 border-2 border-gray-300 rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCode;
