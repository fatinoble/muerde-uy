import React from 'react';
import dynamic from "next/dynamic";
import Layout from '../../../src/components/AdminLayout';
import { Container, Typography } from '@mui/material';
import SaleByDateChart from './components/SaleByDateChart';
import SalesByProductChart from './components/SalesByProductChart';
import SalesByCustomerChart from './components/SalesByCustomerChart';
import StockChart from './components/IngredientStockChart';
import OrdersChart from './components/OrdersChart';
import ProductStockChart from './components/ProductStockChart';
import ReviewScoreQuantityChart from './components/ReviewScoreQuantityChart';
import ReviewProductChart from './components/ReviewProductChart';
const ProductStockChartWithoutSSR = dynamic(
  import("./components/ProductStockChart"),
  { ssr: false }
);

const Reports = () => {

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDateFromMonthAgo = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return formatDate(lastMonth);
  };

  const getDateFromToday = () => {
    const today = new Date();
    return formatDate(today);
  };

  const getDateFromTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return formatDate(tomorrow);
  };

  return (
    // <Layout>
    //   <Container>
    //     <Typography variant="h3" component="h1" align="center" gutterBottom>
    //       Dashboard
    //     </Typography>
    //     <ProductStockChartWithoutSSR />
    //     <OrdersChart />
    //     <StockChart />
    //     <SaleByDateChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()}/>
    //     <SalesByProductChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()}/>
    //     <SalesByCustomerChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()}/>
    //   </Container>
    // </Layout>
    <Layout>
      <Container>
        <section class="grid">
          <article><StockChart /></article>
          <article><OrdersChart /></article>
          <article><ProductStockChartWithoutSSR /></article>
          <article><SaleByDateChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()} tomorrow={getDateFromTomorrow()} /></article>
          <article><SalesByProductChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()} tomorrow={getDateFromTomorrow()} /></article>
          <article><SalesByCustomerChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()} tomorrow={getDateFromTomorrow()} /></article>
          <article><ReviewScoreQuantityChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()} tomorrow={getDateFromTomorrow()} /></article>
          <article><ReviewProductChart /></article>
        </section>
      </Container>
    </Layout>


  );
};

export default Reports;
