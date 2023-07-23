import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ReviewScoreQuantityChart = ({ initStartDate, initEndDate, tomorrow, getReviewColorFromScore = () => { } }) => {
  const [reviewsData, setReviewsData] = useState([]);
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);

  useEffect(() => {
    fetchReviewsScoreData(initStartDate, initEndDate);
  }, []);

  const fetchReviewsScoreData = async (start, end) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review/score?start=${start}&end=${tomorrow}`);
      setReviewsData(data.review_score_quantity);
    } catch (error) {
      console.error('Error fetching reviews score data:', error);
    }
  };

  const handleFilterClick = () => {
    fetchReviewsScoreData(startDate, endDate);
  };

  const getDateLabel = () => {
    if (startDate === initStartDate && endDate === initEndDate) {
      return `Puntaje de reviews de clientes del último mes`;
    }
    else if (startDate && endDate) {
      return `Puntaje de reviews de clientes del ${startDate} al ${endDate}`;
    }
    return 'Puntaje de reviews de clientes';
  };

  return (
    <Container>
      <Typography variant="h6" component="h2" gutterBottom>
        {getDateLabel()}
      </Typography>
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
        <BarChart data={reviewsData}>
          <XAxis dataKey="score" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill={(data) => getReviewColorFromScore(data?.payload?.score)}>
            {reviewsData.map((review, index) => (
              <Cell key={`cell-${index}`} fill={getReviewColorFromScore(review?.score)} />
            ))}
          </Bar >
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default ReviewScoreQuantityChart;
