import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const SalesByProductChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const lastMonthStartDate = getLastMonthStartDate();
    const lastMonthEndDate = getLastMonthEndDate();

    setStartDate(lastMonthStartDate);
    setEndDate(lastMonthEndDate);

    fetchSalesData(lastMonthStartDate, lastMonthEndDate);
  }, []);

  const fetchSalesData = async (start, end) => {
    try {
      const mockedResponse = [
        { product: 'Product A', sales: 20 },
        { product: 'Product B', sales: 10 },
        { product: 'Product C', sales: 15 },
        { product: 'Product D', sales: 8 },
        { product: 'Product E', sales: 12 },
      ];
      // Make API call to retrieve sales data based on the start and end dates
      // const response = await axios.get(`/api/sales?startDate=${start}&endDate=${end}`);
      const data = mockedResponse;
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const handleFilterClick = () => {
    fetchSalesData(startDate, endDate);
  };

  const getLastMonthStartDate = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return formatDate(lastMonth);
  };

  const getLastMonthEndDate = () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    return formatDate(lastDayOfMonth);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDateLabel = () => {
    if (startDate === getLastMonthStartDate() && endDate === getLastMonthEndDate()) {
      return 'Productos más vendidos del último mes';
    } else if (startDate && endDate) {
      return `Productos más vendidos del ${startDate} al ${endDate}`;
    }
    return 'Productos más vendidos';
  };

  return (
    <Container>
      <Typography variant="h6" component="h2" gutterBottom>
        {getDateLabel()}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            label="Fecha de Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Fecha de Fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleFilterClick}>
            Filtrar
          </Button>
        </Grid>
      </Grid>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <XAxis dataKey="product" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default SalesByProductChart;
