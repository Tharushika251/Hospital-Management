// models/ChatMessage.js
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    message: { type: String, required: false }, // Set required to false for image messages
    file: { type: String }, // Add file field to store file URL
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
