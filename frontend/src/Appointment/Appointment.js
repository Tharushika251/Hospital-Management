import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Usernav from '../Navbar/User/UserNav';

const Appointment = () => {
  const [showForm, setShowForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    patientName: '',
    email: '',
    date: '',
    time: '',
    hospitalname: '',
    doctorName: '',
    specialization: '',
  });
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]); // State for appointments
  const [fetchingAppointments, setFetchingAppointments] = useState(true); // State for loading appointments

  useEffect(() => {
    const userEmail = Cookies.get('userEmail');
    if (userEmail) {
      setAppointmentData((prevData) => ({
        ...prevData,
        email: userEmail,
      }));
    }

    // Fetch existing appointments
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:8500/actual-appointments');
        // Filter appointments by email
        const filteredAppointments = res.data.filter(appointment => appointment.email === userEmail);
        setAppointments(filteredAppointments); // Set only matching appointments
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch appointments.');
      } finally {
        setFetchingAppointments(false);
      }
    };

    fetchAppointments();
  }, []);

  const toggleForm = () => setShowForm(!showForm);

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { patientId, patientName, date, time, reason } = appointmentData;
    if (!patientId || !patientName || !date || !time || !reason) {
      toast.error('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8500/appointments/create',
        appointmentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Appointment requested successfully!');
      setAppointmentData({
        patientId: '',
        patientName: '',
        email: Cookies.get('userEmail'),
        date: '',
        time: '',
        reason: '',
      });
      setShowForm(false);

      // Add the newly created appointment to the appointments list
      setAppointments((prev) => [...prev, res.data]); // Assuming the new appointment data is returned from the server
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to request appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8500/actual-appointments/${id}`);
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
      toast.success('Appointment deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete appointment.');
    }
  };

  return (
    <>
      {/* Header */}
      <Usernav />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-4xl font-bold mb-6 text-purple-600">Appointment Page</h1>
        <button
          onClick={toggleForm}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none transition-colors duration-300"
        >
          {showForm ? 'Cancel' : 'Request Appointment'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded shadow-md w-full max-w-md">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientId">
                Patient ID
              </label>
              <input
                type="text"
                name="patientId"
                value={appointmentData.patientId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientName">
                Patient Name
              </label>
              <input
                type="text"
                name="patientName"
                value={appointmentData.patientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <input type="hidden" name="email" value={appointmentData.email} />

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={appointmentData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                number
              </label>
              <input
                type="text"
                name="time"
                value={appointmentData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                Reason for appointment
              </label>
              <textarea
                name="reason"
                value={appointmentData.reason}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter the reason for your appointment"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none transition-colors duration-300 w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}

        {/* Appointments Table */}
        <div className="mt-8 w-auto  bg-white rounded shadow-md overflow-hidden">
          <h2 className="text-2xl font-bold text-center p-4">Scheduled Appointments</h2>
          {fetchingAppointments ? (
            <p className="text-center p-4">Loading appointments...</p>
          ) : (
            <table className="w-auto divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Patient ID</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Patient Name</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Email</th> {/* New column for email */}
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Date</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Time</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">hospitalname</th>
                 
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Doctor Name</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">Specialization</th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">action</th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="px-4 py-2">{appointment.patientId}</td>
                      <td className="px-4 py-2">{appointment.patientName}</td>
                      <td className="px-4 py-2">{appointment.email}</td>
                      <td className="px-4 py-2">{new Date(appointment.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{appointment.time}</td>
                      <td className="px-4 py-2">{appointment.hospitalname}</td>
                      <td className="px-4 py-2">{appointment.doctorName}</td>
                      <td className="px-4 py-2">{appointment.specialization}</td>
                      <td className="px-4 py-2">
                      <button
                       onClick={() => handleDelete(appointment._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300"
                      >
                      cancel
                      </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center p-4">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Appointment;
