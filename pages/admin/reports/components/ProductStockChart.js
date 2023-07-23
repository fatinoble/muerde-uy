/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const ProductStockChart = ({ productsData = [] }) => {
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

  const productsDataForChart = calculateProductsOutOfStockCountData(productsData);

  const getOOSPercentage = (value) => {
    if (typeof value === 'number') {
      return parseFloat(value)?.toFixed(0);
    }
    return value?.toFixed(0);
  }

  return (
    <>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney"> {getOOSPercentage(productsDataForChart[0]?.value)}%</span>
        <span className="featuredMoneyRate">
          Productos sin stock
        </span>
      </div>


      {productsData.map((product) => {
        return (
          product.is_out_of_stock && <span className="featuredSub">{product.title}</span>
        )
      })}
      <div className="center">
        <PieChart width={200} height={200}>
          <Pie
            data={productsDataForChart}
            // cx={420}
            cy={130}
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
      </div>
    </>

  );
};

export default ProductStockChart;
