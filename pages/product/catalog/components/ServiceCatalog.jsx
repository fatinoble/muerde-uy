import React from 'react';
import ProductCard from './ProductCard';
import { Grid } from '@mui/material';
const services = [
  {
    id: 1,
    title: 'Servicio de Pastelería para Cumpleaños',
    price: '$99.99',
    image: '/images/party-cake.jpg',
  },
  {
    id: 2,
    title: 'Servicio de Pastelería para Fiestas de Matrimonio',
    price: '$199.99',
    image: '/images/party-cake.jpg',
  },
  {
    id: 3,
    title: 'Servicio de Pastelería para Eventos Corporativos',
    price: '$149.99',
    image: '/images/party-cake.jpg',
  },
  {
    id: 4,
    title: 'Servicio de Pastelería para Aniversarios',
    price: '$79.99',
    image: '/images/party-cake.jpg',
  },
  {
    id: 5,
    title: 'Servicio de Pastelería para Baby Showers',
    price: '$89.99',
    image: '/images/party-cake.jpg',
  },
  {
    id: 6,
    title: 'Servicio de Pastelería para Eventos Especiales',
    price: '$129.99',
    image: '/images/party-cake.jpg',
  },
];


const ServiceCatalog = ({searchQuery = ''}) => {

  const filteredServices = services.filter((service) =>
  service.title.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
        <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
        {filteredServices.map((service) => (
          <Grid item key={service.id} xs={12} sm={6} md={4}>
            <ProductCard
              imageSrc={service.image}
              title={service.title}
              price={service.price}
            />
          </Grid>
        ))}
      </Grid>
  );
};

export default ServiceCatalog;
