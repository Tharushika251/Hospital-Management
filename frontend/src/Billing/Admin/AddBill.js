import React, { useEffect, useState } from 'react';
import { addBill } from '../../services/BillingAPI';
import PatientDetails from './components/PatientDetails';
import TreatmentDetails from './components/TreatmentDetails';
import PaymentDetails from './components/PaymentDetails';
import AdminNav from '../../Navbar/Admin/AdminNav';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBill = () => {
  const location = useLocation();
  const { data } = location.state || {};
  const [patientName, setPatientName] = useState(data.name);
  const [patientID, setPatientID] = useState(data.id);
  const [appointmentID, setAppointmentID] = useState('');
  const [treatmentDetails, setTreatmentDetails] = useState([
    { description: '', amount: '' },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [paidStatus, setPaidStatus] = useState('unPaid');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    patientName: '',
    patientID: '',
    appointmentID: '',
    balance: '',
  });

  useEffect(() => {
    const total = treatmentDetails.reduce(
      (acc, treatment) => acc + Number(treatment.amount || 0),
      0
    );
    setTotalAmount(total);
    calculateBalance(total, paidAmount);
  }, [treatmentDetails, paidAmount]);

  const calculateBalance = (total, paid) => {
    const balance = total - paid;
    setBalanceAmount(balance);

    if (balance < 0) {
      setErrors((prev) => ({
        ...prev,
        balance: 'Balance amount cannot be negative.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, balance: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.balance) return; // Prevent submission if there's an error

    const billData = {
      patientName,
      patientID,
      appointmentID,
      treatmentDetails,
      totalAmount,
      paymentMethod,
      paidAmount,
      paidStatus,
      balanceAmount,
      insuranceDetails:
        paymentMethod === 'Insurance'
          ? { provider: insuranceProvider, policyNumber }
          : undefined,
    };

    setLoading(true);
    try {
      await addBill(billData);
      toast.success('Bill Added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      clear();
    } catch (error) {
      console.error('Error adding bill:', error);
      alert('Error adding bill.');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setAppointmentID('');
    setTreatmentDetails([{ description: '', amount: '' }]); // Reset to initial state
    setTotalAmount(0); // Reset totalAmount to 0
    setPaymentMethod('Cash'); // Reset to default payment method
    setPaidAmount(0); // Reset paid amount to 0
    setBalanceAmount(0); // Reset balance amount to 0
    setErrors({
      patientName: '',
      patientID: '',
      appointmentID: '',
      balance: '',
    }); // Reset errors
  };

  const isFormValid = () => {
    return !errors.balance && patientName && patientID && appointmentID; // Adjust as needed
  };

  return (
    <>
      <AdminNav />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-24">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Add Hospital Bill
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">Patient Details</h3>
              <PatientDetails
                patientName={patientName}
                setPatientName={setPatientName}
                patientID={patientID}
                setPatientID={setPatientID}
                appointmentID={appointmentID}
                setAppointmentID={setAppointmentID}
                errors={errors}
                setErrors={setErrors}
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">Treatment Details</h3>
              <TreatmentDetails
                treatmentDetails={treatmentDetails}
                setTreatmentDetails={setTreatmentDetails}
                totalAmount={totalAmount}
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">Payment Details</h3>
            {errors.balance && (
              <p className="text-red-600 text-sm">{errors.balance}</p>
            )}
            <PaymentDetails
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              paidAmount={paidAmount}
              setPaidAmount={setPaidAmount}
              balanceAmount={balanceAmount}
              insuranceProvider={insuranceProvider}
              setInsuranceProvider={setInsuranceProvider}
              policyNumber={policyNumber}
              setPolicyNumber={setPolicyNumber}
              paidStatus={paidStatus}
              setPaidStatus={setPaidStatus}
            />
          </div>
          <div className="flex justify-between text-center">
            <Link
              to="/AllBill"
              className="w-1/4 md:w-1/4 text-purple-600 bg-white px-4 py-2 rounded-lg hover:bg-purple-700 hover:text-white border border-black
               transition duration-300 ml-14 hover:border-0"
            >
              {loading ? 'Submitting...' : 'Cancel'}
            </Link>
            <button
              type="submit"
              className={`w-1/4 md:w-1/4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 mr-14 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || !isFormValid()}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddBill;
