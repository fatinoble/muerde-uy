import React from 'react';
import { Tooltip } from '@mui/material';
import dynamic from "next/dynamic";
import InfoIcon from '../../../../src/svg/Info';
import CSVDownloader from '../../../../src/components/CSVDownloader';
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

const StockChart = ({ ingredients = [] }) => {


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

  const ingredientsDataForCSVDownload = ingredients?.map(ingredient => {
    return (
      {
        id: ingredient.id_ingredient,
        nombre: ingredient.name,
        unidad: ingredient.unit,
        porcentage_de_stock: ingredient.stock_percentage_status
      }
    )
  })

  const tooltipText = 'Se considera que un ingrediente tiene 100% de stock cuando cuenta con la cantidad necesaria para utilizarse en la totalidad de sus recetas involucradas al menos 5 veces cada una.';

  return (
    <>
      <div className="featured">

        <div className="featuredItem">
          <div>
            <div className="title-download-container">
              <div>
                <span className="featuredTitle">Porcentaje de stock de ingredientes</span>
                <Tooltip
                  title={tooltipText}
                  placement="top"
                  arrow
                  style={{
                    backgroundColor: '#E28D8D',
                    color: 'white',
                    borderRadius: 4,
                    fontSize: 25,
                    maxWidth: 200,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'inline-block' }}>
                    <InfoIcon className="info-icon" />
                  </div>
                </Tooltip>
              </div>
              {ingredientsDataForCSVDownload && ingredientsDataForCSVDownload.length &&
                <CSVDownloader
                  jsonData={ingredientsDataForCSVDownload}
                  fileName="stock-ingredientes"
                />
              }

            </div>

          </div>
          <br />
          <br />
          <StockBarChartWithoutSSR ingredients={ingredients} getStockIndicatorInfo={getStockIndicatorInfo} stockIndicators={STOCK_INDICATORS} />
        </div>

        <div className="featuredItem">
          <span className="featuredTitle">Rango de stock por ingrediente</span>
          <StockNeedlePieCharttWithoutSSR ingredients={ingredients} getStockIndicatorInfo={getStockIndicatorInfo} stockIndicators={STOCK_INDICATORS} />
        </div>
      </div>
    </>
  );
};

export default StockChart;
