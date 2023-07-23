/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Warnings = () => {
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`);
      setProductsData(data.Products);

    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };

  return (
    <>
      <div className="featuredMoneyContainer">
      </div>


      {productsData.map((product) => {
        return (
          product.is_out_of_stock && <span className="redWarning">El producto "{product.title}" se encuentra sin stock de ingredientes y no está disponible para la venta.</span>
        )
      })}
    </>

  );
};

export default Warnings;
