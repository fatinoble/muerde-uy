import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../../services/utils';
import BarChart from "@mui/icons-material/BarChart";
import dynamic from "next/dynamic";
import Head from 'next/head';
import Layout from '../../../src/components/AdminLayout';
import SaleByDateChart from './components/SaleByDateChart';
import SalesByProductChart from './components/SalesByProductChart';
import SalesByCustomerChart from './components/SalesByCustomerChart';
import StockChart from './components/IngredientStockChart';
import OrdersChart from './components/OrdersChart';
import ReviewScoreQuantityChart from './components/ReviewScoreQuantityChart';
import ReviewProductChart from './components/ReviewProductChart';
import Warnings from './components/Warnings';
import CSVDownloader from '../../../src/components/CSVDownloader'
import { useRouter } from 'next/router';
import { verifyToken } from '../../../services/userService';
import CircularProgress from '@mui/material/CircularProgress';
const ProductStockChartWithoutSSR = dynamic(
  import("./components/ProductStockChart"),
  { ssr: false }
);

const Reports = () => {
  const router = useRouter();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token_admin');
        const response = await verifyToken(token);
        const user = response.data;
        if (!user.id_user || user.role !== 'ADMIN') {
          router.push('/admin/login');
        } else {
          if (!ingredients.length) {
            fetchIngredients();
          }
          if (!productsData.length) {
            fetchProductsData();
          }
          if (!orderStatusData.length) {
            fetchOrderStatusData();
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();

  }, []);

  const fetchOrderStatusData = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/sale/total_progress_status`);
      const data = response.data;
      setOrderStatusData(data.total_progress_status);
    } catch (error) {
      console.error('Error fetching orderStatusData:', error);
    }
  };

  const fetchProductsData = async () => {
    try {
      const { data } = await axios.get(`${getApiUrl()}/product`);
      setProductsData(data.Products);

    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/ingredient`);
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

  const productsDataForCSVDownload = productsData?.map(product => {
    return (
      {
        id: product.id_product,
        titulo: product.title,
        esta_en_stock: product.is_out_of_stock
      }
    )
  })
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }
  return (

    <Layout>
      <Head style={{ marginBottom: '10px' }}>
        <title>Dashboard</title>
      </Head>
      <div className="title-container">
        <h1><BarChart className="icon-title" />Dashboard</h1>
      </div>
      <div className="featured">

        <div className="featuredItem">
          <span className="featuredTitle">Avisos importantes</span>
          <Warnings ingredients={ingredients} productsData={productsData} />
        </div>

        <div className="featuredItem">
          <div className="title-download-container">
            <span className="featuredTitle">Stock de productos</span>
            {productsDataForCSVDownload && productsDataForCSVDownload.length > 0 &&
              <CSVDownloader
                jsonData={productsDataForCSVDownload}
                fileName="stock-productos"
              />
            }
          </div>

          <div className="featuredMoneyContainer">
          </div>
          <ProductStockChartWithoutSSR productsData={productsData} />
        </div>

        <div className="featuredItem">
          <div className="title-download-container">
            <span className="featuredTitle">Estado de pedidos</span>
            {orderStatusData && orderStatusData.length > 0 &&
              <CSVDownloader
                jsonData={orderStatusData}
                fileName="estado-pedidos"
              />
            }
          </div>
          <OrdersChart orderStatusData={orderStatusData} />
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
