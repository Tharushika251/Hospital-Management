// Import necessary components and packages
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from '../Navbar/Admin/AdminNav';
import DoctorAvailabilityForm from './DoctorAvailabilityForm';

const DoctorAvailability = () => {
  const [showForm, setShowForm] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({
    doctorId: '',
    doctorName: '',
    specialization: '',
    date: '',
    startTime: '',
    endTime: '',
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState([]);
  const [fetchingAvailabilities, setFetchingAvailabilities] = useState(true);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const res = await axios.get('http://localhost:8500/doctor-availability');
        setAvailabilities(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch doctor availabilities.');
      } finally {
        setFetchingAvailabilities(false);
      }
    };

    fetchAvailabilities();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      resetForm();
    }
  };

  const resetForm = () => {
    setAvailabilityData({
      doctorId: '',
      doctorName: '',
      specialization: '',
      date: '',
      startTime: '',
      endTime: '',
      isAvailable: true,
    });
  };

  const handleChange = (e) => {
    setAvailabilityData({
      ...availabilityData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { doctorId, doctorName, specialization, date, startTime, endTime } = availabilityData;
    if (!doctorId || !doctorName || !specialization || !date || !startTime || !endTime) {
      toast.error('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (availabilityData._id) {
        const res = await axios.put(`http://localhost:8500/doctor-availability/${availabilityData._id}`, availabilityData);
        toast.success('Doctor availability updated successfully!');
        setAvailabilities(availabilities.map(avail => (avail._id === availabilityData._id ? res.data : avail)));
      } else {
        const res = await axios.post('http://localhost:8500/doctor-availability', availabilityData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success('Doctor availability added successfully!');
        setAvailabilities([...availabilities, res.data]);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add/update availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (avail) => {
    setAvailabilityData({
      doctorId: avail.doctorId,
      doctorName: avail.doctorName,
      specialization: avail.specialization,
      date: avail.date,
      startTime: avail.startTime,
      endTime: avail.endTime,
      isAvailable: avail.isAvailable,
      _id: avail._id,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        await axios.delete(`http://localhost:8500/doctor-availability/${id}`);
        setAvailabilities(availabilities.filter(avail => avail._id !== id));
        toast.success('Doctor availability deleted successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete availability.');
      }
    }
  };

  return (
    <>
      <AdminNav />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-4 pt-20">
        <h1 className="text-4xl font-bold mb-6 text-purple-600">Doctor Availability</h1>
        <DoctorAvailabilityForm 
          availabilityData={availabilityData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          showForm={showForm}
          toggleForm={toggleForm}
          resetForm={resetForm}
          handleEdit={handleEdit}
        />
        
        {fetchingAvailabilities ? (
          <p>Loading...</p>
        ) : (
          <table className="w-auto bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Doctor ID</th>
                <th className="py-2 px-4 border-b">Doctor Name</th>
                <th className="py-2 px-4 border-b">Specialization</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Start Time</th>
                <th className="py-2 px-4 border-b">End Time</th>
                <th className="py-2 px-4 border-b">Available</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map(avail => (
                <tr key={avail._id}>
                  <td className="py-2 px-4 border-b">{avail.doctorId}</td>
                  <td className="py-2 px-4 border-b">{avail.doctorName}</td>
                  <td className="py-2 px-4 border-b">{avail.specialization}</td>
                  <td className="py-2 px-4 border-b">{avail.date}</td>
                  <td className="py-2 px-4 border-b">{avail.startTime}</td>
                  <td className="py-2 px-4 border-b">{avail.endTime}</td>
                  <td className="py-2 px-4 border-b">{avail.isAvailable ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEdit(avail)} className="text-indigo-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(avail._id)} className="text-red-600 hover:underline ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default DoctorAvailability;
