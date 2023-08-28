import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import CSVDownloader from '../../../../src/components/CSVDownloader';

const SalesByDateChart = ({ initStartDate, initEndDate, tomorrow }) => {
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);

  useEffect(() => {
    fetchSalesData(initStartDate, initEndDate);
  }, []);

  const fetchSalesData = async (start, end, isFromFilter) => {
    const endDateForFetching = isFromFilter ? end : tomorrow;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale/sales_earnings_per_day?start=${start}&end=${endDateForFetching}`);
    setSalesData(data.sales_earnings_per_day);
  };

  const handleFilterClick = () => {
    fetchSalesData(startDate, endDate, true);
  };

  const getDateLabel = () => {
    if (startDate === initStartDate && endDate === initEndDate) {
      return `Ventas finalizadas por día del último mes`;
    } else if (startDate && endDate) {
      return `Ventas finalizadas por día del ${startDate} al ${endDate}`;
    }
    return 'Ventas finalizadas por día';
  };


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`${payload[0]?.payload?.date}`}</p>
          <p>{`Ganancias: $${parseFloat(payload[0]?.value)?.toFixed(2)}`}</p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltipQuantity = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`${payload[0]?.payload?.date}`}</p>
          <p>{`Ventas: ${payload[0]?.value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className="title-download-container">
            <Typography variant="h6" component="h2" gutterBottom className="chartTitle">
              {getDateLabel()}
            </Typography>
            {salesData && salesData.length > 0 &&
              <CSVDownloader
                jsonData={salesData}
                fileName={`ventas-ganancias-${startDate}-al-${endDate}`}
              />
            }
          </div>


          <Grid container spacing={2} alignItems="center" className="chartDateSelectorFilter">
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

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              width={500}
              height={200}
              data={salesData}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltipQuantity />} />
              <Area type="monotone" dataKey="quantity" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
          <br />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              width={500}
              height={200}
              data={salesData}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="earnings" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SalesByDateChart;
