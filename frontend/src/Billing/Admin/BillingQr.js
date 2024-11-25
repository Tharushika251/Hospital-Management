import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../Navbar/Admin/AdminNav';

function BillingQr() {
  const [data, setData] = useState(null);
  const [showScanner, setShowScanner] = useState(false); // Toggle between camera and file upload
  const navigate = useNavigate();

  // Function to handle the QR code scan
  const handleScan = (result) => {
    console.log('Scanned result:', result);
    if (result) {
      if (typeof result === 'string') {
        try {
          const parsedData = JSON.parse(result);
          setData(parsedData);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
        }
      } else {
        // If result is already an object, set it directly
        setData(result);
      }
    }
  };

  // Function to handle errors
  const handleError = (err) => {
    console.error(err);
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          // Use jsQR to decode the QR code from the image
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            handleScan(code.data); // Call the handleScan function with the decoded data
          } else {
            console.error('No QR code found in the image.');
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavigate = () => {
    navigate('/AddNewBill', {
      state: { data: data },
    });
  };

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
          Scan QR Code
        </h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowScanner(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-500 transition ease-in-out duration-200"
          >
            Open Camera
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer hover:bg-purple-500 transition ease-in-out duration-200"
          >
            Upload QR Code
          </label>
        </div>

        {showScanner && (
          <div className="flex flex-col items-center mb-6">
            <QrScanner
              onError={handleError}
              onScan={handleScan}
              style={{ width: '300px' }}
            />
            <button
              onClick={() => setShowScanner(false)}
              className="mt-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-400 transition ease-in-out duration-200"
            >
              Close Camera
            </button>
          </div>
        )}

        {data && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Scanned Data:
            </h3>
            <p className="text-lg text-gray-600">
              <strong>ID:</strong> {data.id}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Name:</strong> {data.name}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Email:</strong> {data.email}
            </p>
          </div>
        )}

        {data && (
          <button
            onClick={handleNavigate}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-500 transition ease-in-out duration-200"
          >
            Add New Bill
          </button>
        )}
      </div>
    </>
  );
}

export default BillingQr;
