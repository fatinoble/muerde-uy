/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { InputLabel, Grid, MenuItem, Select } from '@mui/material';
import Rating from '@mui/material/Rating';
import axios from 'axios';

const ReviewProductChart = ({ getReviewColorFromScore = () => { } }) => {
  const [productsData, setProductsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review/product_review_summary`);
      setProductsData(data?.products);
      setSelectedProduct(data?.products[0]?.product);

    } catch (error) {
      console.error('Error fetching products review data:', error);
    }
  };

  const handleProductChange = (event) => {
    const selectedProduct = event.target.value;
    setSelectedProduct(selectedProduct);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`P ${selectedProduct?.score_quantity[index]?.score}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <div className="featured">

        <div className="featuredItem">
          <span className="featuredTitle">Reviews de productos</span>
          <br />
          <br />
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <InputLabel style={{ display: 'inline-block', marginRight: '10px' }} htmlFor="product-select">Seleccionar Producto:</InputLabel>
              <Select
                value={selectedProduct || {}}
                onChange={handleProductChange}
                displayEmpty
              >
                {productsData?.map((productData) => {
                  return (
                    <MenuItem key={productData?.product?.id_product} value={productData}>
                      {productData?.product?.title}
                    </MenuItem>
                  )
                })}
              </Select>
            </Grid>
          </Grid>

          {selectedProduct?.review_summary?.map((reviewSummary) => {
            const backgroundColor = getReviewColorFromScore(reviewSummary?.score);
            return (
              <div className="reviewBox" style={{ backgroundColor }}>
                <Rating
                  name="read-only"
                  readOnly
                  value={reviewSummary?.score}
                />
                <br />
                <span className="reviewDescription">{reviewSummary.description}</span>
              </div>
            )
          })}
        </div>

        <div className="featuredItem">
          <span className="featuredTitle">Porcentaje de puntaje de reviews de {selectedProduct?.title}</span>
          <div className="featuredMoneyContainer">
          </div>


          <ResponsiveContainer width="100%" height={200}>
            <PieChart width={400} height={400}>
              <Pie
                data={selectedProduct?.score_quantity}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantity"
              >
                {selectedProduct?.score_quantity?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getReviewColorFromScore(entry?.score)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default ReviewProductChart;
