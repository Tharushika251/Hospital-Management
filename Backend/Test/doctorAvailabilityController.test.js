// Test/doctorAvailabilityController.test.js

const {
    createDoctorAvailability,
  } = require('../controllers/doctorAvailabilityController');
  const DoctorAvailability = require('../models/DoctorAvailability'); // Adjust the path as needed
  
  jest.mock('../models/DoctorAvailability'); // Mock the DoctorAvailability model
  
  describe('Doctor Availability Controller', () => {
    const availabilityData = {
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '17:00',
    };
  
    it('should create a new doctor availability and return it', async () => {
      const savedAvailability = { id: '123', ...availabilityData };
      DoctorAvailability.prototype.save.mockResolvedValue(savedAvailability); // Mock save method
  
<<<<<<< Updated upstream
      const result = await createDoctorAvailability(availabilityData);
      expect(result).toEqual(savedAvailability); // Check if the result matches the saved availability
      expect(DoctorAvailability.prototype.save).toHaveBeenCalledTimes(1); // Ensure save was called once
=======
        // Mock the save method on the instance
        DoctorAvailability.prototype.save.mockResolvedValue(savedAvailability);
  
        const result = await createDoctorAvailability(availabilityData);
        expect(result).toEqual(savedAvailability);
        expect(DoctorAvailability.prototype.save).toHaveBeenCalledTimes(1);
      });
  
      it('should throw an error when creating a doctor availability fails', async () => {
        DoctorAvailability.prototype.save.mockRejectedValue(new Error('Save failed'));
  
        await expect(createDoctorAvailability({})).rejects.toThrow(
          'Error creating doctor availability: Save failed'
        );
      });
    });
  
    // describe('getAllDoctorAvailabilities', () => {
    //   it('should return all doctor availabilities', async () => {
    //     const availabilities = [
    //       {
    //         _id: '1',
    //         doctorId: 'D001',
    //         doctorName: 'Dr. Smith',
    //         specialization: 'Cardiology',
    //         date: new Date('2024-10-15'),
    //         startTime: '10:00',
    //         endTime: '11:00',
    //         isAvailable: true,
    //       },
    //       {
    //         _id: '2',
    //         doctorId: 'D002',
    //         doctorName: 'Dr. Jones',
    //         specialization: 'Neurology',
    //         date: new Date('2024-10-16'),
    //         startTime: '13:00',
    //         endTime: '14:00',
    //         isAvailable: false,
    //       },
    //     ];
  
    //     // Mock the find method
    //     DoctorAvailability.find.mockResolvedValue(availabilities);
  
    //     const result = await getAllDoctorAvailabilities();
    //     expect(result).toEqual(availabilities);
    //     expect(DoctorAvailability.find).toHaveBeenCalledTimes(1);
    //     expect(DoctorAvailability.find).toHaveBeenCalledWith();
    //   });
  
    // });
  
    describe('getDoctorAvailabilityById', () => {
      it('should return the doctor availability if found', async () => {
        const availability = {
          _id: '123',
          doctorId: 'D001',
          doctorName: 'Dr. Smith',
          specialization: 'Cardiology',
          date: new Date('2024-10-15'),
          startTime: '10:00',
          endTime: '11:00',
          isAvailable: true,
        };
        DoctorAvailability.findById.mockResolvedValue(availability);
  
        const result = await getDoctorAvailabilityById('123');
        expect(result).toEqual(availability);
        expect(DoctorAvailability.findById).toHaveBeenCalledWith('123');
      });
  
      it('should throw an error if the doctor availability is not found', async () => {
        DoctorAvailability.findById.mockResolvedValue(null);
  
        await expect(getDoctorAvailabilityById('123')).rejects.toThrow('Doctor availability not found');
      });
  
      it('should throw an error when fetching doctor availability fails', async () => {
        DoctorAvailability.findById.mockRejectedValue(new Error('Fetch failed'));
  
        await expect(getDoctorAvailabilityById('123')).rejects.toThrow(
          'Error fetching doctor availability: Fetch failed'
        );
      });
    });
  
    describe('updateDoctorAvailability', () => {
      it('should update an existing doctor availability and return it', async () => {
        const availabilityId = '123';
        const updateData = { isAvailable: false };
        const updatedAvailability = {
          _id: '123',
          doctorId: 'D001',
          doctorName: 'Dr. Smith',
          specialization: 'Cardiology',
          date: new Date('2024-10-15'),
          startTime: '10:00',
          endTime: '11:00',
          isAvailable: false,
        };
  
        // Mock findByIdAndUpdate
        DoctorAvailability.findByIdAndUpdate.mockResolvedValue(updatedAvailability);
  
        const result = await updateDoctorAvailability(availabilityId, updateData);
        expect(result).toEqual(updatedAvailability);
        expect(DoctorAvailability.findByIdAndUpdate).toHaveBeenCalledWith(
          availabilityId,
          updateData,
          { new: true, runValidators: true }
        );
      });
  
      it('should throw an error if the doctor availability to update is not found', async () => {
        const availabilityId = '123';
        const updateData = { isAvailable: false };
  
        DoctorAvailability.findByIdAndUpdate.mockResolvedValue(null);
  
        await expect(updateDoctorAvailability(availabilityId, updateData)).rejects.toThrow(
          'Doctor availability not found'
        );
      });
  
      it('should throw an error when updating doctor availability fails', async () => {
        const availabilityId = '123';
        const updateData = { startTime: 'invalid-time' };
  
        DoctorAvailability.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));
  
        await expect(updateDoctorAvailability(availabilityId, updateData)).rejects.toThrow(
          'Error updating doctor availability: Update failed'
        );
      });
    });
  
    describe('deleteDoctorAvailability', () => {
      it('should delete an existing doctor availability and return it', async () => {
        const availabilityId = '123';
        const deletedAvailability = {
          _id: '123',
          doctorId: 'D001',
          doctorName: 'Dr. Smith',
          specialization: 'Cardiology',
          date: new Date('2024-10-15'),
          startTime: '10:00',
          endTime: '11:00',
          isAvailable: true,
        };
  
        // Mock findByIdAndDelete
        DoctorAvailability.findByIdAndDelete.mockResolvedValue(deletedAvailability);
  
        const result = await deleteDoctorAvailability(availabilityId);
        expect(result).toEqual(deletedAvailability);
        expect(DoctorAvailability.findByIdAndDelete).toHaveBeenCalledWith(availabilityId);
      });
  
      it('should throw an error if the doctor availability to delete is not found', async () => {
        const availabilityId = '123';
  
        DoctorAvailability.findByIdAndDelete.mockResolvedValue(null);
  
        await expect(deleteDoctorAvailability(availabilityId)).rejects.toThrow(
          'Doctor availability not found'
        );
      });
  
      it('should throw an error when deleting doctor availability fails', async () => {
        const availabilityId = '123';
  
        DoctorAvailability.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));
  
        await expect(deleteDoctorAvailability(availabilityId)).rejects.toThrow(
          'Error deleting doctor availability: Delete failed'
        );
      });
>>>>>>> Stashed changes
    });
  });
  