import React, { useState, useEffect } from 'react';
import Layout from '../../../src/components/UserLayout';
import { useRouter } from 'next/router';
import { Typography, Button, Box, Snackbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { isObjectEmpty } from '../../../src/utils';
import axios from 'axios';
import WhatsAppServiceButton from './components/WhatsAppServiceButton';
import { getApiUrl } from '../../../services/utils';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const theme = createTheme({
  palette: {
    primary: {
      main: '#A87658',
    },
  },
});

const DetailService = () => {

  const router = useRouter();
  const { id: serviceId } = router.query;
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  useEffect(() => {
    if (!user || isObjectEmpty(user)) {
      const userFromLocalStorage = { user_id: localStorage.getItem('user_id'), name: localStorage.getItem('user_name') };
      setUser(userFromLocalStorage);
    }
  }, []);

  const fetchService = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/service?id=${serviceId}`);
      const serviceResponse = response.data;
      if (serviceResponse && Object.keys(serviceResponse).length > 0) {
        setService(serviceResponse);
      } else {
        setError('Algo salió mal');
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Algo salió mal');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSnackbarClose = () => {
    setError(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginLeft: '0.5rem' }}>
          Cargando servicio...
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

  const { image, title, description, price } = service;

  const whatsappDetailMessage = `!Hola! Soy ${user.name}, y quisiera saber un poco más sobre el servicio ${title}.`;

  return (
    <Layout>

      <div className="product-detail-main-container">
        <ThemeProvider theme={theme}>
          <Box className="product-detail-container">
            <div className="product-detail-image-container">
              <img src={image || '/images/unavailable.png'} alt={title} className="product-detail-image" />
            </div>
            <div className="product-detail-content-container">
              <div className="product-detail-content">
                <div className="product-detail-content-left">
                  <Typography variant="h6" className="product-detail-title-box">
                    {title}
                  </Typography>
                  <Typography className="product-detail-description-box">{description}</Typography>
                  <Typography variant="h6" className="product-detail-price-box">${price}</Typography>
                </div>
                <div className="product-detail-content-middle">
                </div>
                <div className="product-detail-content-right">
                  <div className="service-whatsapp-button-container">
                    <WhatsAppServiceButton message={whatsappDetailMessage} />
                  </div>
                </div>

              </div>
            </div>

          </Box>
        </ThemeProvider>
      </div>
    </Layout>
  );
};

export default DetailService;
