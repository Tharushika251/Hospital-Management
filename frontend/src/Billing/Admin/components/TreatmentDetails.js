import React from 'react';

const TreatmentDetails = ({ treatmentDetails, setTreatmentDetails }) => {

    
  const handleAddTreatment = () => {
    setTreatmentDetails([...treatmentDetails, { description: '', amount: '' }]);
  };

  const handleRemoveTreatment = (index) => {
    const updatedTreatmentDetails = treatmentDetails.filter(
      (_, i) => i !== index
    );
    setTreatmentDetails(updatedTreatmentDetails);
  };

  const handleTreatmentChange = (index, field, value) => {
    const updatedTreatmentDetails = [...treatmentDetails];
    updatedTreatmentDetails[index][field] = value;
    setTreatmentDetails(updatedTreatmentDetails);
  };

  return (
    <div className="space-y-4 mt-9">
      {treatmentDetails.map((treatment, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Description"
            className="w-2/3 px-3 py-2 border border-gray-300 rounded"
            value={treatment.description}
            onChange={(e) =>
              handleTreatmentChange(index, 'description', e.target.value)
            }
            required
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-1/3 px-3 py-2 border border-gray-300 rounded"
            value={treatment.amount}
            onChange={(e) =>
              handleTreatmentChange(index, 'amount', e.target.value)
            }
            required
          />
          <button
            type="button"
            onClick={() => handleRemoveTreatment(index)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddTreatment}
        className="text-blue-600 hover:text-blue-800"
      >
        Add More Treatment
      </button>
    </div>
  );
};

export default TreatmentDetails;
