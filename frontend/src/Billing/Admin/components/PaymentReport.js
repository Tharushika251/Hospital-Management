import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';
import { Box, ButtonGroup, Button } from '@mui/material';

const PaymentReport = ({ payment }) => {
  const [payments, setPayments] = useState(payment || []);
  const [filter, setFilter] = useState('daily'); // Default filter
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    generateReportData();
  }, []);

  const generateReportData = () => {
    const dataMap = {};

    payments.forEach((payment) => {
      const date = moment(payment.date).format(
        filter === 'daily'
          ? 'YYYY-MM-DD'
          : filter === 'weekly'
          ? 'YYYY-ww'
          : 'YYYY-MM'
      );

      if (!dataMap[date]) {
        dataMap[date] = { date, totalAmount: 0 };
      }
      dataMap[date].totalAmount += payment.amount;
    });

    setReportData(Object.values(dataMap));
  };

  return (
    <Box className="bg-gray-50 p-8 rounded-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
        Payment Report
      </h3>

      <ButtonGroup variant="contained" color="primary" className="mb-4">
        <Button onClick={() => setFilter('daily')}>Daily</Button>
        <Button onClick={() => setFilter('weekly')}>Weekly</Button>
        <Button onClick={() => setFilter('monthly')}>Monthly</Button>
      </ButtonGroup>

      <ResponsiveContainer width={768} height={400}>
        <LineChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalAmount" stroke="#4a90e2" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PaymentReport;
