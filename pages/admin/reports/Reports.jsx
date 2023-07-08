import React from 'react';
import Layout from '../../../src/components/AdminLayout';
import { Container, Typography } from '@mui/material';
import SaleByDateChart from './components/SaleByDateChart';
import SalesByProductChart from './components/SalesByProductChart';
import SalesByCustomerChart from './components/SalesByCustomerChart';
import StockChart from './components/StockChart';
import OrdersChart from './components/OrdersChart';

const Reports = () => {

  return (
    <Layout>
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Dashboard
        </Typography>
        <OrdersChart />
        <StockChart />
        <SaleByDateChart />
        <SalesByProductChart />
        <SalesByCustomerChart />
      </Container>
    </Layout>
  );
};

export default Reports;
