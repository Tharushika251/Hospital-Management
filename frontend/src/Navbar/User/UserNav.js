import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaFileAlt,
  FaUserCircle,
  FaCalendarAlt,
} from 'react-icons/fa';
import Cookies from 'js-cookie'; // Import Cookies

const UserNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // To determine user role
  const name = Cookies.get('name');

  useEffect(() => {
    const token = Cookies.get('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setIsAuthenticated(true);
      setUserType(user.type); // Assuming user object has a 'type' field
    } else {
      setIsAuthenticated(false);
      setUserType(null);
    }
  }, [location.pathname]); // Update on route change

  const navLinks = [
    { name: 'Home', icon: <FaHome />, path: '/' },
    { name: 'QRCode', icon: <FaCalendarAlt />, path: '/QrCode' },
    { name: 'Billing', icon: <FaFileAlt />, path: '/bill' },
    { name: 'Appointment', icon: <FaCalendarAlt />, path: '/appointment' },
    // New Appointment link
    {
      name: 'Admin Appointments',
      icon: <FaCalendarAlt />,
      path: '/adminappointment',
    }, // Admin Appointments link
    { name: 'Prescriptions', icon: <FaFileAlt />, path: '/prescriptions' }, // New Prescriptions link
  ];

  // Optionally, restrict certain links based on user role
  const filteredNavLinks = navLinks.filter((link) => {
    if (userType === 'admin') {
      // Admins might have access to all links
      return true;
    }
    if (userType === 'doctor') {
      // Doctors might have specific links
      return ['Home', 'Patients', 'Billing', 'Profile', 'Appointment'].includes(
        link.name
      );
    }
    if (userType === 'pharmacist') {
      // Pharmacists might have specific links
      return ['Home', 'Billing', 'Profile'].includes(link.name);
    }
    // Default for 'patient' or other roles
    return ['Home', 'Billing', 'QRCode', 'Appointment'].includes(link.name);
  });

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('userEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserType(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-4 bg-white shadow-md z-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold mx-auto text-purple-600">
          Hospital System
        </h1>
        <div className="flex items-center space-x-4 mr-5">
          {isAuthenticated && (
            <div className="relative flex items-center space-x-4">
              {/* Display Username */}

              <p className="text-black mr-2 text-2xl">{name}</p>

              {/* Dropdown Menu */}
              <button onClick={toggleDropdown} className="focus:outline-none">
                <FaUserCircle className="text-4xl text-gray-600" />
                <div className="w-full h-full" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-3 mt-48 w-48 bg-white rounded shadow-lg z-30">
                  <ul className="p-2">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none transition-colors duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Desktop Sidebar Navigation */}
      {isAuthenticated && (
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-20 transform transition-transform duration-300 md:block hidden">
          <div className="bg-purple-600 p-4">
            <h2 className="ml-5 text-3xl text-white font-semibold">LESSON</h2>
          </div>
          <ul className="mt-5">
            {filteredNavLinks.map((link) => (
              <li key={link.name} className="md:w-full">
                <Link
                  to={link.path}
                  className={`flex items-center p-5 text-gray-700 text-xl font-medium hover:bg-gray-200 transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'bg-gray-200 font-bold text-purple-500'
                      : ''
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      {isAuthenticated && (
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white shadow-lg z-20">
          <ul className="flex justify-around p-2">
            {filteredNavLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex flex-col items-center p-2 text-gray-700 hover:bg-gray-200 transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'bg-gray-200 font-bold text-purple-500'
                      : ''
                  }`}
                >
                  <span>{link.icon}</span>
                  <span className="text-xs">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};

export default UserNav;
