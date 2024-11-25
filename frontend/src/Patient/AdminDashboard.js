import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Import your CSS
import AdminNav from '../Navbar/Admin/AdminNav';

const AdminDashboard = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]); // New state for patients
  const [formData, setFormData] = useState({
    patientId: '', // Add patientId to form data
    dateOfVisit: '',
    reasonForVisit: '',
    hospital: '',
    attendingDoctor: '',
    diagnosis: '',
  });

  useEffect(() => {
    // Fetch records on component mount
    axios
      .get('http://localhost:8500/api/admin/records', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token in the request
        },
      })
      .then((response) => setRecords(response.data))
      .catch((error) => console.error(error));

    // Fetch patients
    axios
      .get('http://localhost:8500/api/admin/patients', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token in the request
        },
      })
      .then((response) => setPatients(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Post request to add a new record
    axios
      .post('http://localhost:8500/api/admin/records', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT token in the request
        },
      })
      .then((response) => {
        setRecords([...records, response.data]);
        setFormData({
          patientId: '', // Clear patientId
          dateOfVisit: '',
          reasonForVisit: '',
          hospital: '',
          attendingDoctor: '',
          diagnosis: '',
        }); // Clear form after submission
      })
      .catch((error) => console.error('Error adding record:', error));
  };

  const generatePDF = (id) => {
    axios
      .get(`http://localhost:5000/api/admin/report/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token in the request
        },
      })
      .then(() => {
        alert('PDF downloaded');
      })
      .catch((error) => console.error('Error downloading PDF:', error));
  };

  return (
    <>
      <AdminNav />
      <div className="container mx-auto mt-8 pt-20 pl-48">
        <h2>Admin Dashboard</h2>

        <form className="record-form" onSubmit={handleSubmit}>
          <label>Select Patient:</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.username}
              </option>
            ))}
          </select>

          <label>Date of Visit:</label>
          <input
            type="date"
            name="dateOfVisit"
            value={formData.dateOfVisit}
            onChange={handleChange}
            required
          />

          <label>Reason for Visit:</label>
          <input
            type="text"
            name="reasonForVisit"
            placeholder="Reason for Visit"
            value={formData.reasonForVisit}
            onChange={handleChange}
            required
          />

          <label>Hospital:</label>
          <input
            type="text"
            name="hospital"
            placeholder="Hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
          />

          <label>Attending Doctor:</label>
          <input
            type="text"
            name="attendingDoctor"
            placeholder="Attending Doctor"
            value={formData.attendingDoctor}
            onChange={handleChange}
            required
          />

          <label>Diagnosis:</label>
          <input
            type="text"
            name="diagnosis"
            placeholder="Diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
          />

          <button type="submit">Add Record</button>
        </form>

        <h3>Medical Records</h3>
        <table className="records-table">
          <thead>
            <tr>
              <th>Date of Visit</th>
              <th>Reason for Visit</th>
              <th>Hospital</th>
              <th>Attending Doctor</th>
              <th>Diagnosis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.dateOfVisit).toLocaleDateString()}</td>
                <td>{record.reasonForVisit}</td>
                <td>{record.hospital}</td>
                <td>{record.attendingDoctor}</td>
                <td>{record.diagnosis}</td>
                <td>
                  <button
                    className="pdf-button"
                    onClick={() => generatePDF(record._id)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;
