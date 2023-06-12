import React from 'react';
import ProductCard from './ProductCard';
import { Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const products = [
  {
    id: 1,
    title: 'Cruasán',
    price: '$2.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 2,
    title: 'Tarta de Chocolate',
    price: '$19.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 3,
    title: 'Muffin de Arándanos',
    price: '$1.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 4,
    title: 'Galletas de Avena y Pasas',
    price: '$3.49',
    image: '/images/croassant.jpg',
  },
  {
    id: 5,
    title: 'Croissant de Almendra',
    price: '$4.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 6,
    title: 'Donas de Vainilla',
    price: '$1.49',
    image: '/images/croassant.jpg',
  },
  {
    id: 7,
    title: 'Pan de Plátano',
    price: '$5.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 8,
    title: 'Éclair de Frambuesa',
    price: '$3.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 9,
    title: 'Tartaleta de Manzana',
    price: '$2.49',
    image: '/images/croassant.jpg',
  },
  {
    id: 10,
    title: 'Brownie de Nuez',
    price: '$2.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 11,
    title: 'Cupcakes de Fresa',
    price: '$2.49',
    image: '/images/croassant.jpg',
  },
  {
    id: 12,
    title: 'Galletas de Chocolate',
    price: '$1.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 13,
    title: 'Tarta de Limón',
    price: '$17.99',
    image: '/images/croassant.jpg',
  },
  {
    id: 14,
    title: 'Magdalenas de Naranja',
    price: '$1.49',
    image: '/images/croassant.jpg',
  },
  {
    id: 15,
    title: 'Rollos de Canela',
    price: '$3.99',
    image: '/images/croassant.jpg',
  },
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#FDF7E3',
    },
    secondary: {
      main: '#A87658',
    },
  },
});

const ProductCatalog = ({searchQuery = ''}) => {

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard
              imageSrc={product.image}
              title={product.title}
              price={product.price}
            />
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
};

export default ProductCatalog;
