import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from "next/dynamic";
import Layout from '../../../src/components/AdminLayout';
import SaleByDateChart from './components/SaleByDateChart';
import SalesByProductChart from './components/SalesByProductChart';
import SalesByCustomerChart from './components/SalesByCustomerChart';
import StockChart from './components/IngredientStockChart';
import OrdersChart from './components/OrdersChart';
import ReviewScoreQuantityChart from './components/ReviewScoreQuantityChart';
import ReviewProductChart from './components/ReviewProductChart';
import Warnings from './components/Warnings';
const ProductStockChartWithoutSSR = dynamic(
  import("./components/ProductStockChart"),
  { ssr: false }
);

const Reports = () => {
  const [ingredients, setIngredients] = useState([]);
  const [productsData, setProductsData] = useState([]);


  useEffect(() => {
    if (!ingredients.length) {
      fetchIngredients();
    }
    if (!productsData.length) {
      fetchProductsData();
    }
  }, []);

  const fetchProductsData = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`);
      setProductsData(data.Products);

    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient`);
      const data = response.data;
      setIngredients(data.ingredients);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

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

  const getReviewColorFromScore = (score) => {
    switch (score) {
      case 1:
        return '#d434269b';
      case 2:
        return '#d491269b';
      case 3:
        return '#d2d4269b';
      case 4:
        return '#268a1d9b';
      case 5:
        return '#4cff3b9b';
      default:
        return '';
    }
  }

  return (

    <Layout>
      <br />
      <div className="featured">

        <div className="featuredItem">
          <span className="featuredTitle">Avisos importantes</span>
          <Warnings ingredients={ingredients} productsData={productsData} />
        </div>

        <div className="featuredItem">
          <span className="featuredTitle">Stock de productos</span>
          <div className="featuredMoneyContainer">
          </div>
          <ProductStockChartWithoutSSR productsData={productsData} />
        </div>

        <div className="featuredItem">
          <span className="featuredTitle">Estado de pedidos</span>
          <OrdersChart />
        </div>
      </div>

      <div className="big-chart">
        <SaleByDateChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()} tomorrow={getDateFromTomorrow()} />
      </div>

      <StockChart ingredients={ingredients} />


      <div className="big-chart">
        <SalesByProductChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()} tomorrow={getDateFromTomorrow()} />
      </div>

      <div className="big-chart">
        <SalesByCustomerChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()} tomorrow={getDateFromTomorrow()} />
      </div>

      <ReviewProductChart getReviewColorFromScore={getReviewColorFromScore} />

      <div className="big-chart">
        <ReviewScoreQuantityChart initStartDate={getDateFromMonthAgo()} initEndDate={getDateFromToday()} tomorrow={getDateFromTomorrow()} getReviewColorFromScore={getReviewColorFromScore} />
      </div>


    </Layout>


  );
};

export default Reports;
