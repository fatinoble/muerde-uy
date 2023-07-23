/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { InputLabel, Grid, MenuItem, Select } from '@mui/material';
import axios from 'axios';

const ReviewProductChart = () => {
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
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <InputLabel htmlFor="product-select">Seleccionar Producto:</InputLabel>
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

      <span>Reviews del producto {selectedProduct?.title}: </span>
      {selectedProduct?.review_summary?.map((reviewSummary) => {
        return (
          <>
            <span>Puntaje: {reviewSummary.score}</span>
            <span>Descripción: {reviewSummary.description}</span>
          </>
        )
      })}
      <ResponsiveContainer width="100%" height="100%">
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </>

  );
};

export default ReviewProductChart;
