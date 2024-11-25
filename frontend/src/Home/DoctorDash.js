import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DoctorNav from '../Navbar/Doctor/DoctorNav'; // Import the collapsible navigation component

const DoctorDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar visibility
  };

  return (
    <div>
      <DoctorNav sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pass state and toggle function */}

      <div className={`p-8 bg-gray-100 min-h-screen ${sidebarOpen ? 'ml-64' : 'ml-16'}`}> {/* Adjust left margin based on sidebar state */}
        <h2 className="text-2xl font-semibold mb-4">Doctor Dashboard</h2>

        {/* Home Content Area */}
        {location.pathname === '/dashboard' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Welcome, Doctor!</h3>
            <p className="mt-2">Here is an overview of your tasks:</p>

            {/* Cards Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Today's Appointments Card */}
              <div className="bg-white shadow-md p-6 rounded-lg">
                <h4 className="font-bold text-lg">Today's Appointments</h4>
                <p className="text-gray-700">You have 3 appointments scheduled today.</p>
                <a href="/doctorappointments" className="text-indigo-600 hover:underline">View All</a>
              </div>

              {/* Patient Reminders Card */}
              <div className="bg-white shadow-md p-6 rounded-lg">
                <h4 className="font-bold text-lg">Patient Reminders</h4>
                <p className="text-gray-700">You have 2 pending reminders to check.</p>
                <a href="/reminders" className="text-indigo-600 hover:underline">View Reminders</a>
              </div>

              {/* Video Consultation Card */}
              <div className="bg-white shadow-md p-6 rounded-lg">
                <h4 className="font-bold text-lg">Video Consultation</h4>
                <p className="text-gray-700">Start a video consultation with a patient.</p>
                <a href="/video-consultation" className="text-indigo-600 hover:underline">Start Consultation</a>
              </div>

              {/* Chat Functionality Card */}
              <div className="bg-white shadow-md p-6 rounded-lg">
                <h4 className="font-bold text-lg">Chat with Patients</h4>
                <p className="text-gray-700">Send messages or respond to patient inquiries.</p>
                <a href="/chat" className="text-indigo-600 hover:underline">Open Chat</a>
              </div>

              {/* Reports Card */}
              <div className="bg-white shadow-md p-6 rounded-lg">
                <h4 className="font-bold text-lg">Reports</h4>
                <p className="text-gray-700">Generate and view reports.</p>
                <a href="/reports" className="text-indigo-600 hover:underline">View Reports</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
