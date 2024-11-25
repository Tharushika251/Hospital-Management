import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // To handle loading state
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8500/user/login',
        formData
      );

      const { token, name, userId, age, type, qrCode } = res.data;
      console.log(res.data)

      // Set the token cookie (consider setting Secure and HttpOnly flags from the backend if possible)
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });

      // Optionally, set other user details if needed
      Cookies.set('userEmail', email, { expires: 1 });
      Cookies.set('name', name, { expires: 1 });
      Cookies.set('userId', userId, { expires: 7 });
      Cookies.set('age', age, { expires: 1 });
      Cookies.set('type', type, { expires: 1 });
      Cookies.set('qrCode', qrCode, { expires: 1 });

      onLogin(res.data);

      if (type === 'user') {
        navigate('/'); // Redirect to user dashboard
      } else if (type === 'admin') {
        navigate('/admin'); // Redirect to admin dashboard
      } else if (type === 'doctor') {
        navigate('/doctor'); // Redirect to doctor dashboard
      } else {
        console.log('Error: Undefined user type');
        toast.error('Undefined user type. Please contact support.');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || 'Login failed. Please try again.'
      ); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              disabled={loading} // Disable inputs when loading
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              disabled={loading}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 w-full"
              disabled={loading} // Disable the button when loading
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <Link to="/register">
            <button
              type="button"
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors duration-300 w-full mt-4 border-2 border-indigo-600"
              disabled={loading}
            >
              Register
            </button>
          </Link>
        </form>
      </div>
      <ToastContainer /> {/* Add the Toaster for displaying toast messages */}
    </div>
  );
};

export default Login;
