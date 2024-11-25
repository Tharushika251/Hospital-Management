import { Route } from 'react-router-dom';
import AddBill from './../Billing/Admin/AddBill';
import BillList from './../Billing/User/BillList';
import BillDetails from './../Billing/User/BillDetails';
import PaymentPage from './../Billing/User/PaymentPage';
import AllBill from './../Billing/Admin/AllBill';
import BillingQr from '../Billing/Admin/BillingQr';

export default function BillNavigation({ handleLogout }) {
  return (
    <>
      <Route
        path="/AddNewBill"
        element={<AddBill handleLogout={handleLogout} />}
      />
      <Route path="/bill" element={<BillList handleLogout={handleLogout} />} />
      <Route
        path="/billDetails/:billId"
        element={<BillDetails handleLogout={handleLogout} />}
      />
      <Route
        path="/payment"
        element={<PaymentPage handleLogout={handleLogout} />}
      />
      <Route
        path="/AllBill"
        element={<AllBill handleLogout={handleLogout} />}
      />
      <Route
        path="/BillingQr"
        element={<BillingQr handleLogout={handleLogout} />}
      />
    </>
  );
}
