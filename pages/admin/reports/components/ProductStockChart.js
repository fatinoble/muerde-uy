/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ProductStockChart = () => {
  const [productsData, setProductsData] = useState([]);
  const [productsDataForChart, setProductsDataForChart] = useState([]);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`);
      setProductsData(data.Products);
      setProductsDataForChart(calculateProductsOutOfStockCountData(data.Products))

    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };

  const calculateProductsOutOfStockCountData = (products = []) => {
    let outOfStockCount = 0;
    let inStockCount = 0;

    products.forEach((product) => {
      if (product.is_out_of_stock) {
        outOfStockCount++;
      } else {
        inStockCount++;
      }
    });

    const totalProducts = outOfStockCount + inStockCount;

    return [
      { name: 'Sin stock', color: '#FF8042', value: (outOfStockCount / totalProducts) * 100 },
      { name: 'En stock', color: '#00C49F', value: (inStockCount / totalProducts) * 100 }
    ];
  }

  return (
    <>
      <span>Productos sin stock {productsDataForChart[0]?.value}%</span>
      {productsData.map((product) => {
        return (
          product.is_out_of_stock && <span>{product.title}</span>
        )
      })}
      <PieChart width={800} height={400}>
        <Pie
          data={productsDataForChart}
          cx={420}
          cy={200}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {productsDataForChart.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </>

  );
};

export default ProductStockChart;
