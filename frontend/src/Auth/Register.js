import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    type: 'user', 
  });

  const { name, email, password, confirmPassword, age, type } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordMinLength = 8;

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }

    if (password.length < passwordMinLength) {
      alert(`Password must be at least ${passwordMinLength} characters`);
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return false;
    }

    if (age < 1) {
      alert('Please enter a valid age');
      return false;
    }

    return true;
  };

const handleRegister = async () => {
  try {
    const res = await axios.post(
      'http://localhost:8500/user/register',
      formData
    );
    console.log('Response:', res.data);

    // Show success toast message
    toast.success('Registration successful!', {
      position: 'top-right',
      autoClose: 3000,
    });

    // Navigate to login or another page after success
    navigate('/login');
  } catch (err) {
    console.error('Error registering:', err.response?.data || err.message);
    const errorMessage = err.response?.data.msg || 'Error during registration';
    toast.error('Error: ' + errorMessage, {
      position: 'top-right',
      autoClose: 3000,
    });
  }
};


  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await handleRegister();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Register
        </h2>
        <form onSubmit={onSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              User Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your user name"
              required
            />
          </div>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          {/* Password Fields */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          {/* Age Field */}
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Age
            </label>
            <input
              type="number"
              name="age"
              value={age}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your age"
              required
            />
          </div>
          {/* User Type Field */}
          <div className="mb-4">
            <label
              htmlFor="userType"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              User Type
            </label>
            <select
              name="type"
              value={type}
              onChange={onChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          {/* Register Button */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 w-full"
            >
              Register
            </button>
          </div>
          <Link to="/login">
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors duration-300 w-full mt-4 border-2 border-indigo-600">
              Login
            </button>
          </Link>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
