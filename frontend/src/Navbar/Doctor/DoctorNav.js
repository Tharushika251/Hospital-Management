import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaUserCircle,
  FaBars,
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const DoctorNav = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const name = Cookies.get('name');

  const navLinks = [
    { name: 'Home', icon: <FaHome />, path: '/dashboard' },
    { name: 'Patients', icon: <FaUser />, path: '/adminappointment' },
    { name: 'Appointments', icon: <FaFileAlt />, path: '/doctorappointments' },
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Collapsible Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-20 transform transition-transform duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div
          className={`bg-purple-600 p-4 ${
            sidebarOpen ? 'flex' : 'hidden'
          } justify-between`}
        >
          {sidebarOpen && (
            <h2 className="ml-5 text-3xl text-white font-semibold">LESSON</h2>
          )}
          <button onClick={toggleSidebar} className="text-white">
            <FaBars />
          </button>
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
                {sidebarOpen && link.name}{' '}
                {/* Only show link name if sidebar is open */}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DoctorNav;
