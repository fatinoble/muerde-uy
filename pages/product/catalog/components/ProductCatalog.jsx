import React, {useEffect, useMemo, useState} from 'react';
import ProductCard from './ProductCard';
import { Grid, Snackbar, Typography, Box, } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

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
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (!products.length) {
      fetchProducts();
    }
    const allTags = [...new Set(products.flatMap((product) => product.tags))];
    setAllTags(allTags);
  })

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`);
      const data = response.data;
      const catalogProducts = data.Products.filter(product => product.catalog_id !== undefined && product.catalog_id !== null);
      setProducts(catalogProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Algo salió mal');
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginLeft: '0.5rem' }}>
          Cargando productos...
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
    <ThemeProvider theme={theme}>
      <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <a className="product-card-link" href={`/product/detail?id=${product.id_product}`}>
            <ProductCard
              imageSrc="/images/croassant.jpg"
              title={product.title}
              price={product.price}
              
            />
            </a>
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
};

export default ProductCatalog;
