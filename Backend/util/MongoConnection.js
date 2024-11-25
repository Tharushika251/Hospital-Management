const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


class MongoConnection {
    constructor() {
        if (!MongoConnection.instance) {
            this.connection = null; // Initialize connection
            MongoConnection.instance = this; // Assign the instance
        }
        return MongoConnection.instance; // Always return the singleton instance
    }

    async connect() {
        if (!this.connection) {
            try {
                this.connection = await mongoose.connect(process.env.MONGO_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                console.log('MongoDB Connected');
            } catch (error) {
                console.error('Error connecting to MongoDB', error);
                throw error;
            }
        }
        return this.connection; // Return the connection if it already exists
    }
}

const instance = new MongoConnection();
module.exports = instance;

