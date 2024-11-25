import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import AdminNav from '../Navbar/Admin/AdminNav';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:8500/appointments/');
                console.log(response.data); // Log the response to check if patientId is present
                setAppointments(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Error fetching appointments');
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleMarkAsDone = async (id) => {
        try {
            const appointmentToMove = appointments.find(appointment => appointment._id === id);

            if (!appointmentToMove.patientId || !appointmentToMove.patientName) {
                throw new Error('Patient ID or Name missing');
            }

            await axios.post('http://localhost:8500/chatPatients/', {
                appointmentId: id,
                clientId: appointmentToMove.patientId,
                clientName: appointmentToMove.patientName,
            });

            await axios.delete(`http://localhost:8500/appointments/${id}`);

            setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
        } catch (err) {
            setError(err.message || 'Error marking appointment as done');
            console.error(err);
        }
    };

    const handleMessage = (patientId) => {
        navigate(`/message/${patientId}`); // Navigate to the message page with the patientId
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <>
            <AdminNav />
            <div className="admin-container">
                <h2 className="admin-title">Doctor Appointments</h2>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.patientId}</td>
                                <td>{appointment.patientName}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.email}</td>
                                <td>
                                    <button
                                        className="done-button"
                                        onClick={() => handleMarkAsDone(appointment._id)}
                                    >
                                        Mark as Done
                                    </button>
                                    <button
                                        className="message-button"
                                        onClick={() => handleMessage(appointment.patientId)} // Redirect to Message.js
                                    >
                                        Message
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {error && <p className="error">{error}</p>}

                <style jsx>{`
          .admin-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .admin-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
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

          .done-button,
          .message-button {
            padding: 8px 12px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .done-button:hover,
          .message-button:hover {
            background-color: #45a049;
          }

          .loading,
          .error {
            font-size: 18px;
            color: #ff4d4d;
            margin-top: 20px;
          }
        `}</style>
            </div>
        </>
    );
};

export default DoctorAppointments;
