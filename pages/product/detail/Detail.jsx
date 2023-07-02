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
const user = { user_id: 1, name: 'Pedro' };

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const defaultSale = {
  delivery_type: 'PICK_UP',
  user_id: user.user_id,
  user_date: tomorrow.toISOString().split('T')[0],
  products: []
};

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
  const [newSale, setNewSale] = useState(defaultSale);

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
        setNewSale(prevSale => ({
          ...prevSale,
          products: [{
            product_id: productResponse.id_product,
            quantity: 1
          }]
        }));
      } else {
        setError('Algo salió mal');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Algo salió mal');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductQuantity = (newQuantity) => {
    setNewSale(prevSale => {
      const productIndex = prevSale.products.findIndex(product => product.id_product === product.id_product);
      if (productIndex !== -1) {
        const updatedProducts = [...prevSale.products];
        updatedProducts[productIndex] = { ...updatedProducts[productIndex], quantity: newQuantity };
        return {
          ...prevSale,
          products: updatedProducts,
        };
      }
      return prevSale;
    });
  };

  const handleDecrease = () => {
    updateProductQuantity(quantity - 1)
    setQuantity(quantity - 1)
  };

  const handleIncrease = () => {
    updateProductQuantity(quantity + 1)
    setQuantity(quantity + 1)
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

  const { image, title, description, price, is_out_of_stock } = product;

  const whatsappDetailMessage = `!Hola! Soy ${user.name}, y quisiera saber un poco más sobre el producto ${title}.`;

  return (
    <Layout>
      <WhatsAppButton message={whatsappDetailMessage} />
      <div className="product-detail-main-container">
      <ThemeProvider theme={theme}>
        <Box className="product-detail-container">
          <img src="/images/croassant.jpg" alt={title} className="product-detail-image" />
          <div className="product-detail-content">
            <div className="product-detail-content-left">
              <Typography variant="h6" className="product-detail-title-box">
                {title}
              </Typography>
              <Typography variant="h6" className="product-detail-price-box">${price * quantity}</Typography>
            </div>
            <div className="product-detail-content-middle">
            <Typography className="product-detail-description-box">{description}</Typography>
            </div>
            <div className="product-detail-content-right">
              {is_out_of_stock ?
                <span className='oos-pill'>SIN STOCK</span>
                : (
                  <Box className="product-detail-quantity-changer">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: '0.5rem' }}
                      onClick={handleDecrease}
                      disabled={quantity === 1}
                    >
                      -
                    </Button>
                    <Typography variant="body1" className="product-detail-quantity-label">{quantity}</Typography>
                    <Button variant="contained" color="primary" sx={{ marginLeft: '0.5rem' }} onClick={handleIncrease}>
                      +
                    </Button>
                  </Box>
                )
              }
              <SaleDialog product={product} quantity={quantity} setNewSale={setNewSale} newSale={newSale} setError={setError} />

            </div>

          </div>
        </Box>
      </ThemeProvider>
      </div>
    </Layout>
  );
};

export default Detail;
