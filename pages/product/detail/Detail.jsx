import React, { useState, useEffect } from 'react';
import Layout from '../../../src/components/UserLayout';
import WhatsAppButton from '../../../src/components/WhatsAppButton';
import { useRouter } from 'next/router';
import { Typography, Button, Box, Snackbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';
import SaleDialog from './components/SaleDialog';
import axios from 'axios';

//TODO: Manejar user con lógica de usuario
const user = { name: 'Pedro' }

const theme = createTheme({
  palette: {
    primary: {
      main: '#A87658',
    },
  },
});

const Detail = () => {
  const router = useRouter();
  const { id: productId } = router.query;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product?id=${productId}`);
      const productResponse = response.data;
      if (productResponse && Object.keys(productResponse).length > 0) {
        setProduct(productResponse);
      } else {
        setError('Algo salió mal');
      }
    } catch (error) {
      console.log("entre al catch")
      console.error('Error fetching product:', error);
      setError('Algo salió mal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleSnackbarClose = () => {
    setError(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginLeft: '0.5rem' }}>
          Cargando producto...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="error" onClose={handleSnackbarClose}>
          {error}
        </Alert>
      </Snackbar>
    );
  }

  const { image, title, description, price, status } = product;

  const whatsappDetailMessage = `!Hola! Soy ${user.name}, y quisiera saber un poco más sobre el producto ${title}.`;

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/images/croassant.jpg" alt={title} />
          <Typography variant="h6">
            {title}
            <WhatsAppButton message={whatsappDetailMessage} />
          </Typography>
          <Typography variant="body1">{description}</Typography>
          <Typography variant="h6">Precio: ${price * quantity}</Typography>
          {status === 'OUT_OF_STOCK' ?
            <span className='oos-pill'>SIN STOCK</span>
            : (
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: '0.5rem' }}
                  onClick={handleDecrease}
                  disabled={quantity === 1}
                >
                  -
                </Button>
                <Typography variant="body1">{quantity}</Typography>
                <Button variant="contained" color="primary" sx={{ marginLeft: '0.5rem' }} onClick={handleIncrease}>
                  +
                </Button>
              </Box>
            )
          }
          <SaleDialog product={product} quantity={quantity} />
        </Box>
      </ThemeProvider>
    </Layout>
  );
};

export default Detail;
