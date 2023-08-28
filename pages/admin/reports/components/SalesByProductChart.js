import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import CSVDownloader from '../../../../src/components/CSVDownloader';

const SalesByProductChart = ({ initStartDate, initEndDate, tomorrow }) => {
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);

  useEffect(() => {
    fetchSalesData(initStartDate, initEndDate);
  }, []);

  const fetchSalesData = async (start, end, isFromFilter) => {
    try {
      const endDateForFetching = isFromFilter ? end : tomorrow;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale/total_product?start=${start}&end=${endDateForFetching}`);
      const productWithSales = data.sales_by_product?.filter(product => product.sales_count > 0);
      setSalesData(productWithSales);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const handleFilterClick = () => {
    fetchSalesData(startDate, endDate, true);
  };

  const getDateLabel = () => {
    if (startDate === initStartDate && endDate === initEndDate) {
      return 'Productos más vendidos del último mes';
    } else if (startDate && endDate) {
      return `Productos más vendidos del ${startDate} al ${endDate}`;
    }
    return 'Productos más vendidos';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`Ventas totales: ${payload[0].value}`}</p>
          <p>{`Precio: $${payload[0].payload.price}`}</p>
        </div>
      );
    }

    return null;
  };

  const saleProductDataForCSVDownload = salesData?.map(saleData => {
    return (
      {
        id: saleData.id_product,
        titulo: saleData.title,
        total_ventas: saleData.sales_count,
      }
    )
  })

  return (
    <Container>
      <div className="title-download-container">
        <Typography variant="h6" component="h2" gutterBottom>
          {getDateLabel()}
        </Typography>
        {saleProductDataForCSVDownload && saleProductDataForCSVDownload.length > 0 &&
          <CSVDownloader
            jsonData={saleProductDataForCSVDownload}
            fileName={`ventas-productos-${startDate}-al-${endDate}`}
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
      <br />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="sales_count" fill="#9b00ca6d" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default SalesByProductChart;
