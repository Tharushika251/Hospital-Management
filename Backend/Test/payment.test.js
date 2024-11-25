const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const PaymentHistory = require('../models/PaymentHistory'); // Adjust the path as necessary

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('PaymentHistory Model', () => {
    it('should create a payment history record successfully', async () => {
        const paymentData = {
            billId: '67890',
            userId: '12345',
            method: 'online',
            email: 'john@example.com',
            amount: 500,
        };

        const paymentHistory = new PaymentHistory(paymentData);
        const savedPaymentHistory = await paymentHistory.save();

        expect(savedPaymentHistory._id).toBeDefined();
        expect(savedPaymentHistory.billId).toEqual(paymentData.billId);
        expect(savedPaymentHistory.userId).toEqual(paymentData.userId);
        expect(savedPaymentHistory.method).toEqual(paymentData.method);
        expect(savedPaymentHistory.email).toEqual(paymentData.email);
        expect(savedPaymentHistory.amount).toEqual(paymentData.amount);
        expect(savedPaymentHistory.status).toEqual('pending'); // Default value
        expect(savedPaymentHistory.date).toBeDefined(); // Default value
    });

    it('should throw a validation error if required fields are missing', async () => {
        const paymentHistory = new PaymentHistory({}); // No fields

        await expect(paymentHistory.save()).rejects.toThrow();
    });

    it('should set default status to pending', async () => {
        const paymentData = {
            billId: '67890',
            userId: '12345',
            method: 'online',
            email: 'john@example.com',
            amount: 500,
        };

        const paymentHistory = new PaymentHistory(paymentData);
        const savedPaymentHistory = await paymentHistory.save();

        expect(savedPaymentHistory.status).toBe('pending');
    });

    it('should only allow valid status values', async () => {
        const paymentData = {
            billId: '67890',
            userId: '12345',
            method: 'online',
            email: 'john@example.com',
            amount: 500,
            status: 'invalidStatus', // Invalid status
        };

        const paymentHistory = new PaymentHistory(paymentData);

        await expect(paymentHistory.save()).rejects.toThrow();
    });
});
