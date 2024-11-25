import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaCalendarCheck,
  FaUserCircle,
  FaBars,
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const AdminNav = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to false for initial closed state
  const name = Cookies.get('name');
  const navigate = useNavigate();

  // Updated navLinks to include the Appointments section
  const navLinks = [
    { name: 'Home', icon: <FaHome />, path: '/admin' },
    { name: 'Patients', icon: <FaUser />, path: '/patients' },
    { name: 'Billing', icon: <FaFileAlt />, path: '/AllBill' },
    { name: 'Appointments', icon: <FaFileAlt />, path: '/adminappointment' },
    {
      name: 'Doctor Availability',
      icon: <FaCalendarCheck />,
      path: '/doctor-availability',
    }, // New Doctor Availability link
  ];

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('userEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <header className="flex fixed top-0 left-0 w-full p-4 bg-white shadow-md z-10  justify-between items-center">
        <h1 className="relative left-1/3 text-3xl font-bold text-purple-600 ">
          Hospital Management System
        </h1>

        {/* Button to toggle the sidebar on mobile */}
        <button onClick={toggleSidebar} className="p-2 md:hidden">
          <FaBars
            className={`text-2xl transition-transform duration-300 ${
              sidebarOpen ? 'rotate-90' : ''
            }`}
          />
        </button>

        {/* User section with dropdown */}
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
      </header>

      {/* Desktop Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-20 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="bg-purple-600 p-4">
          <h2 className="ml-5 text-3xl text-white font-semibold">LESSON</h2>
        </div>
        <ul className="mt-5">
          {navLinks.map((link) => (
            <li key={link.name} className="md:w-full">
              <Link
                to={link.path}
                className={`flex items-center p-5 text-gray-700 text-xl font-medium hover:bg-gray-200 transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'bg-gray-200 text-purple-500 font-bold'
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
    </>
  );
};

export default AdminNav;
