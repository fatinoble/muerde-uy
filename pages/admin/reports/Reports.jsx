import React from 'react';
import Layout from '../../../src/components/AdminLayout';
import { Container, Typography } from '@mui/material';
import SaleByDateChart from './components/SaleByDateChart';
import SalesByProductChart from './components/SalesByProductChart';
import SalesByCustomerChart from './components/SalesByCustomerChart';
import StockChart from './components/StockChart';
import OrdersChart from './components/OrdersChart';

const Reports = () => {

  const getDateFromMonthAgo = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return formatDate(lastMonth);
  };

  const getDateFromToday = () => {
    const today = new Date();
    return formatDate(today);
  };
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Dashboard
        </Typography>
        <OrdersChart />
        <StockChart />
        <SaleByDateChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()}/>
        <SalesByProductChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()}/>
        <SalesByCustomerChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()}/>
      </Container>
    </Layout>
  );
};

export default Reports;
