import React from 'react';
import { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import dynamic from "next/dynamic";
import axios from 'axios';
const StockNeedlePieCharttWithoutSSR = dynamic(
  import("./IngredientStockPieNeedleChart"),
  { ssr: false }
);
const StockBarChartWithoutSSR = dynamic(
  import("./IngredientStockBarChart"),
  { ssr: false }
);

const STOCK_INDICATORS = [
  { name: 'Sin stock', value: 1, color: '#ff0000' },
  { name: 'Stock bajo', value: 29, color: '#e0d500' },
  { name: 'Stock alto', value: 60, color: '#007800' },
  { name: 'Stock abundante', value: 10, color: '#0ad80a' },
];

const StockChart = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (!ingredients.length) {
      fetchIngredients();
    }
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient`);
      const data = response.data;
      setIngredients(data.ingredients);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const getStockIndicatorInfo = (ingredient = {}) => {
    if (!ingredient || Object.keys(ingredient).length === 0) return {};
    if (ingredient.stock_percentage_status <= STOCK_INDICATORS[0].value) {
      return STOCK_INDICATORS[0];
    } else if (ingredient.stock_percentage_status > STOCK_INDICATORS[0].value && ingredient.stock_percentage_status <= STOCK_INDICATORS[1].value) {
      return STOCK_INDICATORS[1];
    } else if (ingredient.stock_percentage_status > STOCK_INDICATORS[1].value && ingredient.stock_percentage_status <= STOCK_INDICATORS[2].value) {
      return STOCK_INDICATORS[2];
    } else {
      return STOCK_INDICATORS[3];
    }
  }

  const tooltipText = 'Se considera que un ingrediente tiene 100% de stock cuando cuenta con la cantidad necesaria para utilizarse en la totalidad de sus recetas involucradas al menos 5 veces cada una.';

  return (
    <>
      <Tooltip
        title={tooltipText}
        placement="top"
        arrow
        styles={{
          backgroundColor: '#E28D8D',
          color: 'white',
          borderRadius: 4,
          fontSize: 12,
          maxWidth: 200,
          textAlign: 'center',
        }}
      >
        <div>Info.</div>
      </Tooltip>
      <StockBarChartWithoutSSR ingredients={ingredients} getStockIndicatorInfo={getStockIndicatorInfo} stockIndicators={STOCK_INDICATORS} />
      <StockNeedlePieCharttWithoutSSR ingredients={ingredients} getStockIndicatorInfo={getStockIndicatorInfo} stockIndicators={STOCK_INDICATORS} />
    </>
  );
};

export default StockChart;
