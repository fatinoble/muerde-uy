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

const ProductCard = ({ imageSrc, title, price, isOutOfStock }) => {
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ height: '100%', opacity: isOutOfStock ? '60%' : '100%' }} className="product-card-container">
        <CardMedia component="img" src={imageSrc} alt={title} className="product-card-image"/>
        <CardContent>
          <div className="top-info-card">
            <Typography variant="h6" component="div" color="primary">
              {title}
            </Typography>
            {isOutOfStock && <span className='oos-pill'>SIN STOCK</span>}
          </div>
          <Typography variant="body1" color="secondary">
            {price}
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default ProductCard;
