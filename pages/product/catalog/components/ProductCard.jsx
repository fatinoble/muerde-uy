import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D79E8C',
    },
    secondary: {
      main: '#A87658',
    },
  },
});

const ProductCard = ({ imageSrc, title, price }) => {
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ height: '100%' }}>
        <CardMedia component="img" src={imageSrc} alt={title} />
        <CardContent>
          <Typography variant="h6" component="div" color="primary">
            {title}
          </Typography>
          <Typography variant="body1" color="secondary">
            {price}
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default ProductCard;
