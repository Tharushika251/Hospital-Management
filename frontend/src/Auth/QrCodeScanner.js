import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr'; // This library will help decode QR codes from images.

const QrCodeScanner = () => {
  const [data, setData] = useState(null);
  const [showScanner, setShowScanner] = useState(false); // Toggle between camera and file upload

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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Scan QR Code</h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowScanner(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-500 transition duration-200"
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
          className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow cursor-pointer hover:bg-blue-500 transition duration-200"
        >
          Upload QR Code
        </label>
      </div>

      {showScanner && (
        <div className="flex flex-col items-center">
          <QrScanner
            onError={handleError}
            onScan={handleScan}
            style={{ width: '300px' }}
          />
          <button
            onClick={() => setShowScanner(false)} // Close the camera
            className="mt-4 bg-red-600 text-white px-5 py-3 rounded-lg shadow hover:bg-red-500 transition duration-200"
          >
            Close Camera
          </button>
        </div>
      )}

      {data && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-80">
          <h3 className="text-xl font-semibold text-gray-700">Scanned Data:</h3>
          <p className="mt-2">
            <strong>ID:</strong> {data.id}
          </p>
          <p className="mt-1">
            <strong>Name:</strong> {data.name}
          </p>
          <p className="mt-1">
            <strong>Email:</strong> {data.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;
