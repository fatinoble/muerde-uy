import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesByDateChart = () => {
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
    // Mocked response data for sales chart by date
    const mockedResponse = [
      { date: '2023-06-01', quantity: 10, earnings: 100 },
      { date: '2023-06-02', quantity: 8, earnings: 80 },
      { date: '2023-06-03', quantity: 15, earnings: 150 },
      { date: '2023-06-04', quantity: 12, earnings: 120 },
      { date: '2023-06-05', quantity: 20, earnings: 200 },
    ];

    // Simulate API call delay with setTimeout
    setTimeout(() => {
      setSalesData(mockedResponse);
    }, 500); // Adjust the delay time as needed
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
      return `Ventas por día del último mes`;
    } else if (startDate && endDate) {
      return `Ventas por día del ${startDate} al ${endDate}`;
    }
    return 'Ventas por día';
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" gutterBottom>
            {getDateLabel()}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <TextField
                label="Inicio"
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
                label="Fin"
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
            <LineChart data={salesData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
              <Line type="monotone" dataKey="earnings" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SalesByDateChart;
