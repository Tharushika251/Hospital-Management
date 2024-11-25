// src/components/AdminAppointments.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from '../Navbar/Admin/AdminNav';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the form fields
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    email: '',
    date: '',
    time: '',
    hospitalname: '',
    doctorName: '',
    specialization: '',
  });

  // State for showing/hiding the create appointment form
  const [showCreateForm, setShowCreateForm] = useState(false);

  // State for available doctors based on selected date
  const [availableDoctors, setAvailableDoctors] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8500/appointments/');
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error fetching appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch available doctors whenever the date changes
  useEffect(() => {
    const fetchAvailableDoctors = async () => {
      if (!formData.date) {
        setAvailableDoctors([]);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8500/doctor-availability/', {
          params: { date: formData.date },
        });
        setAvailableDoctors(response.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch available doctors.');
        setAvailableDoctors([]);
      }
    };

    fetchAvailableDoctors();
  }, [formData.date]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8500/appointments/${id}`);
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
      toast.success('Appointment deleted successfully!');
    } catch (err) {
      setError(err.message || 'Error deleting appointment');
      console.error(err);
      toast.error('Failed to delete appointment.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset doctorName and specialization if date changes
    if (name === 'date') {
      setFormData((prev) => ({ ...prev, doctorName: '', specialization: '' }));
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
        // Optional: Validate that doctorName is selected and available
        if (!formData.doctorName) {
            toast.error('Please select an available doctor.');
            return;
        }

        // Get specialization from the availableDoctors array based on selected doctor
        const selectedDoctor = availableDoctors.find(
            (doc) => doc.doctorName === formData.doctorName
        );

        // Ensure that specialization is available
        if (!selectedDoctor || !selectedDoctor.specialization) {
            toast.error('Specialization is required.');
            return;
        }

        // Include specialization in the formData being sent to the backend
        const response = await axios.post('http://localhost:8500/actual-appointments/', {
            ...formData,
            specialization: selectedDoctor.specialization, // Add specialization here
        });

        setAppointments((prev) => [...prev, response.data]);
        toast.success('Appointment created successfully!');
        setFormData({
            patientId: '',
            patientName: '',
            email: '',
            date: '',
            time: '',
            hospitalname: '',
            doctorName: '',
            specialization: '',
        }); // Reset form
        setShowCreateForm(false); // Hide form after submission
    } catch (err) {
        setError(err.response?.data?.message || 'Error creating appointment');
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to create appointment.');
    }
};


  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <AdminNav />
      <div className="admin-container">
        <h2 className="admin-title">Appointment Requests</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-button"
        >
          {showCreateForm ? 'Cancel' : 'Create Appointment'}
        </button>

        {showCreateForm && (
          <form onSubmit={handleCreateAppointment} className="appointment-form">
            <h3>Create Appointment</h3>
            <input
              type="text"
              name="patientId"
              placeholder="Patient ID"
              value={formData.patientId}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <input
              type="text"
              name="hospitalname"
              placeholder="Hospital Name"
              value={formData.hospitalname}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctorName">Doctor Name</label>
              <select
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">Select a Doctor</option>
                {availableDoctors.length > 0 ? (
                  availableDoctors.map((doctor) => (
                    <option key={doctor.doctorId} value={doctor.doctorName}>
                      {doctor.doctorName} - {doctor.specialization}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No doctors available on this date
                  </option>
                )}
              </select>
            </div>

            {/* Optionally, display the specialization based on selected doctor */}
            {formData.doctorName && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialization">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={
                    availableDoctors.find(
                      (doc) => doc.doctorName === formData.doctorName
                    )?.specialization || ''
                  }
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            )}

            <button type="submit" className="submit-button">
              Add Appointment
            </button>
          </form>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Email</th> {/* New column for email */}
              <th>description</th> {/* New column for email */}
          
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.patientId}</td>
                <td>{appointment.patientName}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.email}</td> {/* Display email */}
                <td>{appointment.reason}</td> {/* Display email */}
            
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <p className="error">{error}</p>} {/* Display error if any */}

        {/* Inline CSS for the component */}
        <style jsx>{`
          .admin-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .admin-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
          }

          .create-button, .submit-button {
            padding: 10px 20px;
            margin: 10px 0;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .create-button:hover, .submit-button:hover {
            background-color: #45a049;
          }

          .appointment-form {
            margin: 20px 0;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .appointment-form input, .appointment-form select {
            display: block;
            margin: 10px auto;
            padding: 10px;
            width: 80%;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .admin-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          .admin-table th,
          .admin-table td {
            padding: 12px;
            border: 1px solid #ccc;
            text-align: left;
          }

          .admin-table th {
            background-color: #4caf50;
            color: white;
            text-transform: uppercase;
          }

          .admin-table tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          .admin-table tr:hover {
            background-color: #ddd;
          }

          .delete-button {
            padding: 8px 12px;
            background-color: #ff4d4d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .delete-button:hover {
            background-color: #ff1a1a;
          }

          .loading,
          .error {
            font-size: 18px;
            color: #ff4d4d;
            margin-top: 20px;
          }
        `}</style>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminAppointments;
