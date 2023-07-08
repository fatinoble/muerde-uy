import React from 'react';
import dynamic from "next/dynamic";
const StockNeedlePieCharttWithoutSSR = dynamic(
  import("./StockPieNeedleChart"),
  { ssr: false }
);
const StockBarChartWithoutSSR = dynamic(
  import("./StockBarChart"),
  { ssr: false }
);

const STOCK_INDICATORS = [
  { name: 'Sin stock', value: 1, color: '#ff0000' },
  { name: 'Stock bajo', value: 29, color: '#fbf12a' },
  { name: 'Stock abundante', value: 70, color: '#0ad80a' },
];

const ingredients = [
  {
    id_ingredient: 1,
    name: 'Azucar',
    unit: 'G',
    stock_percentage_status: 20
  },
  {
    id_ingredient: 2,
    name: 'Huevo',
    unit: 'UN',
    stock_percentage_status: 45
  },
  {
    id_ingredient: 3,
    name: 'Harina',
    unit: 'G',
    stock_percentage_status: 0
  },
]

const StockChart = () => {
  const getStockIndicatorInfo = (ingredient = {}) => {
    const sortedIndicators = STOCK_INDICATORS.sort((a, b) => a.value - b.value);
    const nextTopIndex = sortedIndicators.findIndex(indicator => indicator.value > ingredient.stock_percentage_status);

    if (nextTopIndex !== -1) {
      return sortedIndicators[nextTopIndex];
    }
  }

  return (
    <>
      <StockBarChartWithoutSSR ingredients={ingredients} getStockIndicatorInfo={getStockIndicatorInfo} stockIndicators={STOCK_INDICATORS} />
      <StockNeedlePieCharttWithoutSSR ingredients={ingredients} getStockIndicatorInfo={getStockIndicatorInfo} stockIndicators={STOCK_INDICATORS} />
    </>
  );
};

export default StockChart;
