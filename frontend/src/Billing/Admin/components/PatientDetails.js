import React from 'react';


const PatientDetails = ({
  patientName,
  setPatientName,
  patientID,
  setPatientID,
  appointmentID,
  setAppointmentID,
  errors, // pass errors for validation messages
  setErrors, // function to update error messages
}) => {

  // Handle input change for all fields
  const handleInputChange = (setter, field, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    setter(value);
  };

  // Validate the patient name input
  const validatePatientName = (value) => {
    const isValid = /^[^0-9]*$/.test(value) || /[a-zA-Z]/.test(value); // Must contain at least one letter
    if (!isValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        patientName:
          'Patient name cannot be only numbers and must contain at least one letter.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        patientName: '', // Clear error if valid
      }));
      setPatientName(value);
    }
  };


  // Handle blur event to validate the field when the user leaves it
  const handleBlur = (field) => {
    if (field === 'patientName') {
      if (!patientName) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          patientName: 'Patient name is required.',
        }));
      } else {
        validatePatientName(patientName);
      }
    }

    if (field === 'patientID') {
      if (!patientID) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          patientID: 'Patient ID is required.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          patientID: '', // Clear error if valid
        }));
      }
    }

    if (field === 'appointmentID') {
      if (!appointmentID) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          appointmentID: 'Appointment ID is required.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          appointmentID: '', // Clear error if valid
        }));
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Patient Name */}
      <div>
        <label className="block text-gray-700">Patient Name:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          value={patientName}
          onChange={(e) => validatePatientName(e.target.value)}
          onBlur={() => handleBlur('patientName')}
          required
          readOnly={true}
        />
        {errors.patientName && (
          <p className="text-red-600 text-sm">{errors.patientName}</p>
        )}
      </div>

      {/* Patient ID */}
      <div>
        <label className="block text-gray-700">Patient ID:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          value={patientID}
          onChange={(e) =>
            handleInputChange(setPatientID, 'patientID', e.target.value)
          }
          onBlur={() => handleBlur('patientID')}
          readOnly={true} // Auto-filled, hence read-only
          required
        />
        {errors.patientID && (
          <p className="text-red-600 text-sm">{errors.patientID}</p>
        )}
      </div>

      {/* Appointment ID */}
      <div>
        <label className="block text-gray-700">Appointment ID:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          value={appointmentID}
          onChange={(e) =>
            handleInputChange(setAppointmentID, 'appointmentID', e.target.value)
          }
          onBlur={() => handleBlur('appointmentID')}
          required
        />
        {errors.appointmentID && (
          <p className="text-red-600 text-sm">{errors.appointmentID}</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
