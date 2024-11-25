import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get patientId from URL

const Message = () => {
    const { patientId } = useParams(); // Get the patient ID from the route parameter
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);

    // Fetch messages when the component loads and when patientId changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (patientId) {
                try {
                    const response = await axios.get(`/chat/messages/${patientId}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error.response ? error.response.data : error.message);
                }
            }
        };
        fetchMessages();
    }, [patientId]);

    // Handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent form submission
        const formData = new FormData();
        formData.append('sender', 'Doctor');
        formData.append('receiver', patientId);

        if (file) {
            formData.append('file', file); // Append the selected image file
        } else {
            formData.append('message', inputValue); // Append the text message
        }

        try {
            const response = await axios.post('http://localhost:8500/chat/messages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Add the new message to the messages state
            setMessages([...messages, response.data]);
            // Clear input fields
            setInputValue('');
            setFile(null);
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the selected file
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <div className="flex-1 overflow-auto p-4">
                <h2 className="text-xl font-semibold mb-4">Message Patient {patientId}</h2>

                {/* Display chat messages */}
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`p-2 rounded-lg ${msg.sender === 'Doctor' ? 'ml-auto bg-indigo-200' : 'mr-auto bg-gray-300'}`} style={{ minWidth: '215px', maxWidth: '70%', width: 'fit-content' }}>
                            <span>{msg.message}</span>
                            {msg.file && <img src={`http://localhost:8500/${msg.file}`} alt="attachment" style={{ width: '200px', height: 'auto', borderRadius: '5px' }} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Input form for sending messages */}
            <form
                onSubmit={handleSendMessage}
                className="flex p-5 bg-white border-t border-gray-300"
                style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white' }}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="ml-2 p-2 border rounded"
                />
                <button
                    type="submit"
                    className="ml-2 p-2 bg-indigo-600 text-white rounded"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Message;
