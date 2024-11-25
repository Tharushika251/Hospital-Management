const {
  createBill,
  getBillById,
  getBillsByUserId,
  getPaymentHistoryByUserId,
} = require('../controllers/billController');
const MedicalBill = require('../models/MedicalBill');

jest.mock('../models/MedicalBill');

describe('Bill Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBill', () => {
    it('should create a new bill and return it', async () => {
      const billData = {
        patientName: 'John Doe',
        patientID: '12345',
        totalAmount: 1000,
        paidAmount: 500,
        balanceAmount: 500,
        paymentMethod: 'Cash',
      };
      const savedBill = { _id: '123', ...billData };

      MedicalBill.prototype.save.mockResolvedValue(savedBill);

      const result = await createBill(billData);
      expect(result).toEqual(savedBill);
      expect(MedicalBill.prototype.save).toHaveBeenCalled();
    });

    it('should throw an error when creating a bill fails', async () => {
      MedicalBill.prototype.save.mockRejectedValue(new Error('Save failed'));

      await expect(createBill({})).rejects.toThrow(
        'Error creating the bill: Save failed'
      );
    });
  });

  describe('getBillById', () => {
    it('should return the bill if found', async () => {
      const bill = { _id: '123', patientName: 'John Doe' };
      MedicalBill.findById.mockResolvedValue(bill);

      const result = await getBillById('123');
      expect(result).toEqual(bill);
    });

    it('should throw an error if the bill is not found', async () => {
      MedicalBill.findById.mockResolvedValue(null);

      await expect(getBillById('123')).rejects.toThrow('Bill not found');
    });
  });

  
  describe('getBillsByUserId', () => {
    it('should return bills for a given user', async () => {
      const bills = [{ _id: '123' }];
      MedicalBill.find.mockResolvedValue(bills);

      const result = await getBillsByUserId('12345');
      expect(result).toEqual(bills);
    });

    it('should throw an error if fetching bills fails', async () => {
      MedicalBill.find.mockRejectedValue(new Error('Fetch failed'));

      await expect(getBillsByUserId('12345')).rejects.toThrow(
        'Error fetching bills: Fetch failed'
      );
    });
  });

  describe('getPaymentHistoryByUserId', () => {
    it('should return payment history for a given user', async () => {
      const bills = [
        { _id: '1', patientID: '12345', paidStatus: 'paid', totalAmount: 1000 },
        {
          _id: '2',
          patientID: '12345',
          paidStatus: 'partially paid',
          totalAmount: 500,
        },
      ];
      MedicalBill.find.mockResolvedValue(bills);

      const result = await getPaymentHistoryByUserId('12345');
      expect(result).toEqual(bills);
      expect(MedicalBill.find).toHaveBeenCalledWith({
        patientID: '12345',
        paidStatus: { $in: ['paid', 'partially paid'] },
      });
    });

    it('should throw an error if fetching payment history fails', async () => {
      MedicalBill.find.mockRejectedValue(new Error('Fetch failed'));

      await expect(getPaymentHistoryByUserId('12345')).rejects.toThrow(
        'Error fetching payment history: Fetch failed'
      );
    });
  });

  describe('getPaymentHistoryByUserId - Negative Cases', () => {
    it('should throw an error if the userId is invalid', async () => {
      await expect(getPaymentHistoryByUserId(null)).rejects.toThrow(
        'Invalid user ID'
      );
    });

    it('should throw an error if no bills are found for the given user', async () => {
      MedicalBill.find.mockResolvedValue([]); // Return empty array to simulate no bills found

      await expect(getPaymentHistoryByUserId('invalidUserID')).rejects.toThrow(
        'No payment history found for this user'
      );
    });

    it('should throw an error if the database operation fails', async () => {
      MedicalBill.find.mockRejectedValue(new Error('Database failure')); // Simulate a DB error

      await expect(getPaymentHistoryByUserId('12345')).rejects.toThrow(
        'Error fetching payment history: Database failure'
      );
    });
  });
});
