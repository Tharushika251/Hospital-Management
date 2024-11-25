// src/pages/ChatHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const patientsData = [
    { id: 1, name: 'Patient A' },
    { id: 2, name: 'Patient B' },
    { id: 3, name: 'Patient C' },
];

const ChatHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState(patientsData);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        // Filter patients based on the search term
        const filtered = patientsData.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(filtered);
    }, [searchTerm]);

    const handlePatientClick = async (patientId) => {
        setSelectedPatient(patientId);
        try {
            const response = await axios.get(`/chat/messages/${patientId}`);
            console.log('Fetched messages:', response.data); // Log fetched messages
            setChatMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Chat History</h2>
            <input
                type="text"
                placeholder="Search Patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border rounded"
            />
            <ul className="mb-4">
                {filteredPatients.map(patient => (
                    <li key={patient.id} className="cursor-pointer mb-2" onClick={() => handlePatientClick(patient.id)}>
                        {patient.name}
                    </li>
                ))}
            </ul>
            {selectedPatient && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Messages with {filteredPatients.find(p => p.id === selectedPatient)?.name}</h3>
                    <div className="space-y-4">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`p-2 rounded-lg max-w-xs ${msg.sender === 'Doctor' ? 'ml-auto bg-indigo-200' : 'mr-auto bg-gray-300'}`}>
                                <span>{msg.message}</span>
                                {msg.file && <img src={`http://localhost:8500/${msg.file}`} alt="attachment" style={{ width: '200px', height: 'auto', borderRadius: '5px' }} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatHistory;
