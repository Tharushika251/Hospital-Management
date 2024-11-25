// routers/ChatRouter.js
const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up storage for files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    },
});

const upload = multer({ storage });

// Save a chat message
router.post('/messages', upload.single('file'), async (req, res) => {
    const { sender, receiver, message } = req.body;
    let fileUrl = '';

    // Check if a file was uploaded
    if (req.file) {
        fileUrl = req.file.path; // Save the file path
    }

    // Create a new message based on whether it's a text or an image
    const newMessage = new ChatMessage({
        sender,
        receiver,
        message: fileUrl ? null : message, // Set message to null if a file is uploaded
        file: fileUrl, // Save the file URL if an image is sent
    });

    try {
        await newMessage.save(); // Save to the database
        res.status(201).json(newMessage); // Respond with the new message
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Error saving message' });
    }
});

// Get messages for a specific patient or doctor
router.get('/messages/:receiverId', async (req, res) => {
    const { receiverId } = req.params;
    try {
        const messages = await ChatMessage.find({ receiver: receiverId }).sort({ timestamp: 1 });
        res.status(200).json(messages); // Respond with messages
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

module.exports = router;
