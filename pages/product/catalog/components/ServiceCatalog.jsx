import React, { useEffect, useMemo, useState, memo } from 'react';
import ServiceCard from './ServiceCard';
import { Grid } from '@mui/material';
import axios from 'axios';


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

  return (
    <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
      {filteredServices.map((service) => (
        <Grid item key={service.id} xs={12} sm={6} md={4}>
          <a className="product-card-link" href={`/product/detailService?id=${service.id_service}`} key={service.id_service}>
            <ServiceCard
              imageSrc={service.image || '/images/unavailable.png'}
              title={service.title}
              price={service.price}
            /></a>
        </Grid>
      ))}
    </Grid>
  );
};

export default ServiceCatalog;
