import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Message = () => {
    const { patientId } = useParams(); // Get patientId from route params
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);
    const [patients, setPatients] = useState([]); // Fetch patient list

    useEffect(() => {
        // Fetch patients (users with type 'user') if needed
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:8500/user/users');
                setPatients(response.data); // Set the list of patients
            } catch (error) {
                console.error('Error fetching patients:', error.message);
            }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        // Fetch chat messages for the selected patient
        const fetchMessages = async () => {
            if (patientId) {
                try {
                    const response = await axios.get(`http://localhost:8500/chat/messages/${patientId}`);
                    setMessages(response.data); // Set the fetched messages
                } catch (error) {
                    console.error('Error fetching messages:', error.message);
                }
            }
        };
        fetchMessages();
    }, [patientId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('sender', 'Doctor');
        formData.append('receiver', patientId); // Use patientId as the receiver

        if (file) {
            formData.append('file', file); // Send image file if available
        } else {
            formData.append('message', inputValue); // Send text message
        }

        try {
            const response = await axios.post('http://localhost:8500/chat/messages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessages([...messages, response.data]); // Add new message to the messages state
            setInputValue(''); // Clear input field
            setFile(null); // Clear file input
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <h2>
                Message Patient
                {/* Display the selected patient's name here if needed */}
                {patients.map((patient) => (
                    <span key={patient._id}>
                        {' '}{patient.name} {/* Fetch and display patient names */}
                    </span>
                ))}
            </h2>

            {/* Message History */}
            <div className="message-history">
                {messages.map((msg, index) => (
                    <div key={index}>
                        {/* Display text message if available */}
                        {msg.message && <p>{msg.message}</p>}

                        {/* Display image if available */}
                        {msg.file && (
                            <div>
                                <img
                                    src={`http://localhost:8500/${msg.file}`}
                                    alt="attachment"
                                    style={{ width: '200px', height: 'auto', borderRadius: '5px' }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="message-form">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                />
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Message;
