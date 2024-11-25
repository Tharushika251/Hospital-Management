import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ProtectedRoute from './Auth/ProtectedRoute';
import DoctorDash from './Home/DoctorDash';
import DoctorAppointments from './Pages/DoctorAppointments';
import Reminders from './Pages/Reminders';
import Reports from './Pages/Reports';
import VideoConsultation from './Pages/VideoConsultation';
import Chat from './Pages/Chat';
import ChatHistory from './Pages/ChatHistory';
import Message from './Pages/Message';
import UserTypeSelection from './Auth/UserTypeSelection'; // Import UserTypeSelection
import Appointment from './Appointment/Appointment'; // Import the Appointment component
import AdminAppointments from './Appointment/AdminAppointments';
import DoctorAvailability from './Appointment/DoctorAvailability ';
import BillNavigation from './Navigation/BillNavigation';
import AdminDashboard from './Patient/AdminDashboard';
import PatientDashboard from './Patient/PatientDashboard';
import QrCode from './Auth/QrCode';
import { QrScanner } from 'react-qr-scanner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restore authentication state from localStorage on page load
    const isAuthenticatedFromStorage =
      localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticatedFromStorage) {
      setIsAuthenticated(true);
    }
  }, []); // This effect runs only once on component mount

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true'); // Store 'true' as a string
    localStorage.setItem('user', JSON.stringify(userData)); // Store user as a JSON string
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/usertype" element={<UserTypeSelection />} />
        <Route path="/QrCode" element={<QrCode />} />
        <Route path="/QrScanner" element={<QrScanner />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="user"
            >
              <PatientDashboard handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="admin"
            >
              <AdminDashboard handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="doctor"
            >
              <DoctorDash handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        {BillNavigation(handleLogout)}
        <Route
          path="/appointment"
          element={<Appointment handleLogout={handleLogout} />}
        />{' '}
        {/* New Appointment route */}
        <Route
          path="/adminappointment"
          element={<AdminAppointments handleLogout={handleLogout} />}
        />{' '}
        {/* New Appointment route */}
        <Route
          path="/doctor-availability"
          element={<DoctorAvailability handleLogout={handleLogout} />}
        />
        <Route
          path="/dashboard"
          element={<DoctorDash handleLogout={handleLogout} />}
        />
        <Route
          path="/doctorappointments"
          element={<DoctorAppointments handleLogout={handleLogout} />}
        />
        <Route
          path="/reminders"
          element={<Reminders handleLogout={handleLogout} />}
        />
        <Route
          path="/reports"
          element={<Reports handleLogout={handleLogout} />}
        />
        <Route
          path="/video-consultation"
          element={<VideoConsultation handleLogout={handleLogout} />}
        />
        <Route path="/chat" element={<Chat handleLogout={handleLogout} />} />
        <Route
          path="/chathistory"
          element={<ChatHistory handleLogout={handleLogout} />}
        />
        <Route
          path="/message/:patientId"
          element={<Message handleLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;


