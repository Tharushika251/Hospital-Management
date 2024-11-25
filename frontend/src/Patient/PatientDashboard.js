import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDashboard.css'; // Add your CSS here
import UserNav from '../Navbar/User/UserNav';

const PatientDashboard = () => {
    const [records, setRecords] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phoneNumber: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // Fetch user information
        axios.get('http://localhost:8500/api/user/me', {
            headers: { 'Authorization': `Bearer ${token}` } // Use Authorization header
        })
        .then(response => {
            const user = response.data;
            setUserInfo(user);
        })
        .catch(error => console.error("Error fetching user info:", error));

        // Fetch medical records
        axios.get('http://localhost:8500/api/patient/records', {
            headers: { 'Authorization': `Bearer ${token}` } // Use Authorization header
        })
        .then(response => setRecords(response.data))
        .catch(error => console.error("Error fetching records:", error));

        // Fetch prescriptions
        axios.get('http://localhost:8500/api/patient/prescriptions', {
            headers: { 'Authorization': `Bearer ${token}` } // Use Authorization header
        })
        .then(response => setPrescriptions(response.data))
        .catch(error => console.error("Error fetching prescriptions:", error));

        // Fetch allergies
        axios.get('http://localhost:8500/api/patient/allergies', {
            headers: { 'Authorization': `Bearer ${token}` } // Use Authorization header
        })
        .then(response => setAllergies(response.data))
        .catch(error => console.error("Error fetching allergies:", error));
    }, []);

    const handleAllergySubmit = (e) => {
        e.preventDefault();
        const allergyInput = e.target.elements[0].value; // Get allergy input value
        if (allergyInput) {
            // Submit allergy data to your backend API
            axios.post('http://localhost:8500/api/patient/allergies', { name: allergyInput }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } // Use Authorization header
            })
            .then(response => {
                setAllergies([...allergies, response.data]);
                e.target.reset(); // Reset form after submission
            })
            .catch(error => console.error("Error adding allergy:", error));
        }
    };

    const generatePDF = (id) => {
        axios.get(`http://localhost:8500/api/patient/report/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } // Use Authorization header
        })
        .then(() => {
            alert('PDF downloaded');
        })
        .catch(error => console.error("Error downloading PDF:", error));
    };

    return (
      <>
        <UserNav />
        <div className="container mx-auto mt-8 pt-20 pl-48">
          <h2>
            Welcome, {userInfo.firstName} {userInfo.lastName}
          </h2>
          <p>Email: {userInfo.email}</p>
          <p>Address: {userInfo.address}</p>
          <p>Phone Number: {userInfo.phoneNumber}</p>

          <h2>Medical Records</h2>
          <table className="medical-records-table">
            <thead>
              <tr>
                <th>Date of Visit</th>
                <th>Reason for Visit</th>
                <th>Hospital</th>
                <th>Attending Doctor</th>
                <th>Final Diagnosis</th>
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
                      className="view-button"
                      onClick={() => generatePDF(record._id)}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="scrollable-sections">
            <div className="prescriptions-section">
              <h3>Active Prescriptions</h3>
              <ul>
                {prescriptions.map((prescription) => (
                  <li key={prescription._id}>
                    <p>Doctor: {prescription.doctor}</p>
                    <p>Hospital: {prescription.hospital}</p>
                    <p>
                      Date: {new Date(prescription.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="allergies-section">
              <h3>Allergies</h3>
              <form onSubmit={handleAllergySubmit}>
                <input type="text" placeholder="Enter Allergy" required />
                <button type="submit">Add Allergy</button>
              </form>
              <ul>
                {allergies.map((allergy) => (
                  <li
                    key={allergy._id}
                    className={
                      allergy.severity === 'high' ? 'high-risk' : 'low-risk'
                    }
                  >
                    <p>{allergy.name}</p>
                    <p>{allergy.severity === 'high' ? 'HIGH' : 'LOW'}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
};

export default PatientDashboard;
