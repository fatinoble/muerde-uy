import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import CSVDownloader from '../../../../src/components/CSVDownloader';

const SalesByCustomerChart = ({ initStartDate, initEndDate, tomorrow }) => {
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);

  useEffect(() => {
    fetchSalesData(initStartDate, initEndDate);
  }, []);

  const fetchSalesData = async (start, end, isFromFilter) => {
    try {
      const endDateForFetching = isFromFilter ? end : tomorrow;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale/total_customer?start=${start}&end=${endDateForFetching}`);
      setSalesData(data.sales_by_customer);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const handleFilterClick = () => {
    fetchSalesData(startDate, endDate, true);
  };

  const getDateLabel = () => {
    if (startDate === initStartDate && endDate === initEndDate) {
      return `Clientes con más ventas del último mes`;
    }
    else if (startDate && endDate) {
      return `Clientes con más ventas del ${startDate} al ${endDate}`;
    }
    return 'Clientes con más ventas';
  };

  return (
    <Container>

      <div className="title-download-container">
        <Typography variant="h6" component="h2" gutterBottom>
          {getDateLabel()}
        </Typography>
        {salesData && salesData.length > 0 &&
          <CSVDownloader
            jsonData={salesData}
            fileName={`ventas-clientes-${startDate}-al-${endDate}`}
          />
        }
      </div>

      <br />
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
      <br />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#002fca6d" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default SalesByCustomerChart;
