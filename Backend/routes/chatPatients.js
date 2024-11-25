const express = require('express');
const router = express.Router();
const ChatPatient = require('../models/ChatPatient');

// POST route to create a new chat patient entry
router.post('/', async (req, res) => {
    const { appointmentId, clientId, clientName } = req.body;

    // Log the incoming data for debugging
    console.log({ appointmentId, clientId, clientName });

    const newChatPatient = new ChatPatient({
        appointmentId,
        clientId,
        clientName,
    });

    try {
        const savedChatPatient = await newChatPatient.save();
        res.status(201).json(savedChatPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET route to fetch all chat patients
router.get('/', async (req, res) => {
    try {
        const chatPatients = await ChatPatient.find().select('clientId clientName'); // Adjust this to return only the fields you need
        res.json(chatPatients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
