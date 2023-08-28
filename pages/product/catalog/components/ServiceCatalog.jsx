import React, { useEffect, useMemo, useState } from 'react';
import ServiceCard from './ServiceCard';
import axios from 'axios';
import { Snackbar, Typography, Box, } from '@mui/material';
import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';


const ServiceCatalog = ({ searchQuery = '', selectedTags }) => {

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredServices = useMemo(() => {
    if (searchQuery && selectedTags?.length > 0) {
      return services.filter((service) => {
        return (
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          selectedTags.every((tag) => service.tags?.includes(tag))
        );
      });
    } else if (searchQuery) {
      return services.filter((service) => {
        return service.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    } else if (selectedTags?.length > 0) {
      return services.filter((service) => {
        return selectedTags.every((tag) => service.tags?.includes(tag));
      });
    } else {
      return services;
    }
  }, [services, searchQuery, selectedTags]);

  useEffect(() => {
    if (!services?.length) {
      fetchServices();
    }
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service`);
      const data = response.data;
      const catalogService = data.Services.filter(service => service.catalog_id !== undefined && service.catalog_id !== null && service.status === 'ENABLED');
      setServices(catalogService);
    } catch (error) {
      console.error('Error fetching services:', error);
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
          Cargando servicios...
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

  return (
    <div className="product-catalog">
      {filteredServices.map((service) => (
          <a className="product-card-link" href={`/product/detailService?id=${service.id_service}`} key={service.id_service}>
          <ServiceCard
            imageSrc={service.image || '/images/unavailable.png'}
            title={service.title}
            price={service.price}
          /></a>
      ))}
    </div>
  );
};

export default ServiceCatalog;
