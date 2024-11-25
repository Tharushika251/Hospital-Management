import React, { useEffect, useState } from 'react';
import { getBillingBYUserId } from '../../services/BillingAPI';
import { useNavigate } from 'react-router-dom';
import BillHistory from './components/BillHistory';
import OutstandingBills from './components/OutstandingBills';
import Usernav from '../../Navbar/User/UserNav';
import Cookies from 'js-cookie';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const userId = Cookies.get('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await getBillingBYUserId(userId);
        setBills(response.data);
      } catch (error) {
        setError('Error fetching bills');
      }
    };

    fetchBills();
  }, [userId]);

  const filteredOutstandingBills = bills.filter(
    (bill) =>
      bill.paidStatus === 'unPaid' ||
      bill.paidStatus === 'pending' &&
      bill.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPaidBills = bills.filter(
    (bill) =>
      bill.paidStatus === 'paid' &&
      bill.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) return <p>{error}</p>;

  return (
    <>
      {/* Header */}
      <Usernav />
      <div className="md:pl-80 md:mt-16 md:max-w-full bg-slate-200 md:py-10 md:pr-28 py-24 px-10">
        <div className="md:max-w-4xl md:ml-10">
          {/* Outstanding Bills */}
          <OutstandingBills
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            bill={filteredOutstandingBills}
            navigate={navigate}
          />

          {/* Bill History */}
          <BillHistory
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            bill={filteredPaidBills}
            navigate={navigate}
          />
        </div>
      </div>
    </>
  );
};

export default BillList;
