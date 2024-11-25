import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBillById } from '../../services/BillingAPI';
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import UserNav from '../../Navbar/User/UserNav';
import { useNavigate } from 'react-router-dom';

// Invoice component using @react-pdf/renderer
const BillInvoicePDF = ({ bill }) => (
  <Document>
    <Page style={styles.page}>
      {/* Hospital Name */}
      <Text style={styles.title}>Leesons Hospital</Text>

      {/* Invoice Details */}
      <View style={styles.section}>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Ref Number:</Text> {bill._id}
        </Text>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Billing Date:</Text> {bill.issuedDate}
        </Text>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Due Date:</Text> 2024-12-08
        </Text>
      </View>

      {/* Patient Info */}
      <View style={styles.section}>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Patient Name:</Text> {bill.patientName}
        </Text>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Appoinment Number:</Text>{' '}
          {bill.appointmentID}
        </Text>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Registration Date:</Text> {bill.issuedDate}
        </Text>
      </View>

      {/* Table: Services / Items */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>
            Service / Item
          </Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>
            Amount (Rs.)
          </Text>
        </View>

        {/* Table Rows */}
        {bill.treatmentDetails.map((service, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{service.description}</Text>
            <Text style={styles.tableCell}>Rs. {service.amount}</Text>
          </View>
        ))}
      </View>

      {/* Total Amounts */}
      <View style={styles.section}>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Total Amount:</Text> Rs. {bill.totalAmount}
        </Text>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Amount Paid:</Text> Rs. {bill.paidAmount}
        </Text>
        <Text style={styles.invoiceDetails}>
          <Text style={styles.bold}>Balance:</Text> Rs. {bill.balanceAmount}
        </Text>
      </View>
    </Page>
  </Document>
);
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    backgroundColor: '#f9fafb', // Soft light background for modern look
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1f2937', // Darker gray-blue for a bold look
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: '#1f2937', // Same dark color to maintain consistency
  },
  invoiceDetails: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#4b5563', // Gray for details text
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 25,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #1362ff', // Light gray for table borders
  },
  tableHeader: {
    backgroundColor: '#e2e8f0', // Subtle background for header
  },
  tableCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#374151', // Dark gray for table content
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 14,
    color: '#1f2937',
  },
});

const BillDetails = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await getBillById(billId);
        setBill(response.data);
      } catch (error) {
        setError('Error fetching bill details');
      }
    };

    fetchBillDetails();
  }, [billId]);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/payment', {
      state: { billId: bill._id, amounts: bill.balanceAmount },
    });
  };

  if (error) return <p>{error}</p>;
  if (!bill) return <p>Loading...</p>;

  return (
    <>
      <UserNav />
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center mt-16 mb-16">
        <div className="bg-white rounded-lg p-10 shadow-2xl max-w-lg md:max-w-3xl w-full border border-gray-300">
          {/* Hospital Name */}
          <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900 uppercase tracking-wider">
            Leesons Hospital
          </h2>

          {/* Invoice Details */}
          <div className="mb-8 flex justify-between">
            <div>
              <p className="text-lg font-semibold">
                <strong>Ref Number:</strong> {bill._id}
              </p>
              <p className="text-lg font-semibold">
                <strong>Billing Date:</strong> {bill.issuedDate}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold"></p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="mb-8">
            <p className="text-lg font-semibold">
              <strong>Patient Name:</strong> {bill.patientName}
            </p>
            <p className="text-lg font-semibold">
              <strong>Appoinment Number:</strong> {bill.appointmentID}
            </p>
            <p className="text-lg font-semibold">
              <strong>Reg. Date:</strong> {bill.issuedDate}
            </p>
          </div>

          {/* Services/Items Table */}
          <table className="w-full mb-8 text-left text-lg border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b-2 pb-2 px-4 text-gray-700">
                  Service / Item
                </th>
                <th className="border-b-2 pb-2 px-4 text-gray-700 text-right">
                  Amount (Rs.)
                </th>
              </tr>
            </thead>
            <tbody>
              {bill.treatmentDetails.map((service, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {service.description}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">
                    Rs. {service.amount}.00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Amounts */}
          <div className="mb-8 mr-4">
            <div className="flex justify-between text-lg font-semibold">
              <p>
                <strong>Total Amount:</strong>
              </p>
              <p>
                Rs.
                {bill.totalAmount}.00
              </p>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <p>
                <strong>Amount Paid:</strong>
              </p>
              <p>Rs. {bill.paidAmount}.00</p>
            </div>
            <hr className="border-2 mb-1" />
            <hr className="border-2" />
            <div className="flex justify-between text-lg font-semibold">
              <p>
                <strong>Balance:</strong>
              </p>
              <p>Rs. {bill.balanceAmount}.00</p>
            </div>
          </div>

          {/* Buttons: Download Invoice and Pay Bill */}
          <div className="flex justify-between items-center">
            {/* PDF Download Link */}
            <PDFDownloadLink
              document={<BillInvoicePDF bill={bill} />}
              fileName="invoice.pdf"
            >
              {({ loading }) => (
                <button className="bg-purple-600 text-white px-6 py-3 w-56 rounded-md shadow-md hover:bg-purple-700 transition-all duration-200 mx-2 font-semibold">
                  {loading ? 'Preparing Invoice...' : 'Download Invoice'}
                </button>
              )}
            </PDFDownloadLink>

            {/* Show "Pay Bill" button only if payment is pending */}
            {bill.paidStatus === 'unPaid' && (
              <button
                className="bg-green-600 text-white px-6 py-3 w-32 rounded-md shadow-md hover:bg-green-700 transition-all duration-200 mx-5 font-semibold"
                onClick={handleNavigate}
              >
                Pay Bill
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BillDetails;
