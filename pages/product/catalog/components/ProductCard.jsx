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

const ProductCard = ({ imageSrc, title, price, status }) => {
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ height: '100%', opacity: status === 'OUT_OF_STOCK' ? '60%' : '100%' }}>
        <CardMedia component="img" src={imageSrc} alt={title} />
        <CardContent>
          <div className="top-info-card">
            <Typography variant="h6" component="div" color="primary">
              {title}
            </Typography>
            {status === 'OUT_OF_STOCK' && <span className='oos-pill'>SIN STOCK</span>}
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
