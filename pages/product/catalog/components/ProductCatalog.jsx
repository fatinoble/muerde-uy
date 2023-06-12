import React, {useEffect, useMemo} from 'react';
import ProductCard from './ProductCard';
import { Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const products = [
  {
    id: 1,
    title: 'Cruasán',
    price: '$2.99',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Tradicional', 'Crujiente'],
  },
  {
    id: 2,
    title: 'Tarta de Chocolate',
    price: '$19.99',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Decorado'],
  },
  {
    id: 3,
    title: 'Muffin de Arándanos',
    price: '$1.99',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Esponjoso'],
  },
  {
    id: 4,
    title: 'Galletas de Avena y Pasas',
    price: '$3.49',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Saludable'],
  },
  {
    id: 5,
    title: 'Croissant de Almendra',
    price: '$4.99',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Crujiente'],
  },
  {
    id: 6,
    title: 'Donas de Vainilla',
    price: '$1.49',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Esponjoso'],
  },
  {
    id: 7,
    title: 'Pan de Plátano',
    price: '$5.99',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Tradicional', 'Saludable'],
  },
  {
    id: 8,
    title: 'Éclair de Frambuesa',
    price: '$3.99',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Relleno', 'Decorado'],
  },
  {
    id: 9,
    title: 'Tartaleta de Manzana',
    price: '$2.49',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Tradicional'],
  },
  {
    id: 10,
    title: 'Brownie de Nuez',
    price: '$2.99',
    image: '/images/croassant.jpg',
    tags: ['Dulce', 'Nueces'],
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

const ProductCatalog = ({searchQuery = '', setAllTags, selectedTags}) => {
  const filteredProducts = useMemo(() => {
    if (searchQuery && selectedTags.length > 0) {
      return products.filter((product) => {
        return (
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          selectedTags.every((tag) => product.tags?.includes(tag))
        );
      });
    } else if (searchQuery) {
      return products.filter((product) => {
        return product.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    } else if (selectedTags.length > 0) {
      return products.filter((product) => {
        return selectedTags.every((tag) => product.tags?.includes(tag));
      });
    } else {
      return products;
    }
  }, [products, searchQuery, selectedTags]);
  

  useEffect(() => {
    const allTags = [...new Set(products.flatMap((product) => product.tags))];
    setAllTags(allTags);
  })

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
