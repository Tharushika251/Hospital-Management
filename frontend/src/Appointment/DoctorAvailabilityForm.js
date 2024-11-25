import React from 'react';

const DoctorAvailabilityForm = ({ availabilityData, handleChange, handleSubmit, loading, showForm, toggleForm, resetForm, handleEdit }) => (
  <div>
    <button onClick={toggleForm} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors duration-300 mb-4">
      {showForm ? 'Cancel' : 'Add Availability'}
    </button>

    {showForm && (
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-2xl mb-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Fields for Doctor Availability */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctorId">Doctor ID</label>
            <input type="text" name="doctorId" value={availabilityData.doctorId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctorName">Doctor Name</label>
            <input type="text" name="doctorName" value={availabilityData.doctorName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialization">Specialization</label>
            <input type="text" name="specialization" value={availabilityData.specialization} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
            <input type="date" name="date" value={availabilityData.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">Start Time</label>
            <input type="time" name="startTime" value={availabilityData.startTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">End Time</label>
            <input type="time" name="endTime" value={availabilityData.endTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="isAvailable" checked={availabilityData.isAvailable} onChange={() => handleChange({ target: { name: 'isAvailable', value: !availabilityData.isAvailable } })} className="mr-2" />
            <label className="text-gray-700 text-sm font-bold">Available</label>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300" disabled={loading}>
            {loading ? 'Loading...' : (availabilityData._id ? 'Update Availability' : 'Add Availability')}
          </button>
        </div>
      </form>
    )}
  </div>
);

export default DoctorAvailabilityForm;
