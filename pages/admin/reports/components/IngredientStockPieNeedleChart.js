/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { InputLabel, Grid, MenuItem, Select } from '@mui/material';

const RADIAN = Math.PI / 180;
const cx = 150;
const cy = 200;
const iR = 50;
const oR = 100;

const needle = (value, stockIndicators, cx, cy, iR, oR, color) => {
  let total = 0;
  stockIndicators?.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
  ];
};
const StockPieNeedleChart = ({ ingredients = [], getStockIndicatorInfo = () => { }, stockIndicators }) => {
  const [selectedIngredient, setSelectedIngredient] = useState(ingredients[0] || {});
  console.log("selected ingredientt ", selectedIngredient)
  const handleIngredientChange = (event) => {
    const selectedIngredient = event.target.value;
    setSelectedIngredient(selectedIngredient);
  };

  useEffect(() => {
    if (ingredients && ingredients.length > 0) {

      setSelectedIngredient(ingredients[0]);
    }
  }, [ingredients]);

  return (
    <>
      <br />
      <br />
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <InputLabel htmlFor="ingredient-select" className="featuredSub">Seleccionar Ingrediente:
            <Select
              value={selectedIngredient || {}}
              onChange={handleIngredientChange}
              displayEmpty
            >
              {ingredients?.map((ingredient) => (
                <MenuItem key={ingredient.key} value={ingredient}>
                  {ingredient.name}
                </MenuItem>
              ))}
            </Select>
          </InputLabel>
          <span style={{ color: getStockIndicatorInfo(selectedIngredient)?.color }}>{getStockIndicatorInfo(selectedIngredient)?.name}</span >
        </Grid>
      </Grid>
      <div className="center" style={{ marginTop: '-30px' }}>
        <PieChart width={400} height={250}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={stockIndicators}
            cx={cx}
            cy={cy}
            innerRadius={iR}
            outerRadius={oR}
            fill="#8884d8"
            stroke="none"
          >
            {stockIndicators?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {needle(selectedIngredient.stock_percentage_status, stockIndicators, cx, cy, iR, oR, '#d0d000')}
        </PieChart>
      </div>

    </>
  );
};

export default StockPieNeedleChart;
