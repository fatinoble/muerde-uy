import React, { useEffect, useMemo, useState, memo } from 'react';
import ProductCard from './ProductCard';
import { Grid, Snackbar, Typography, Box, } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { getApiUrl } from '../../../../services/utils';

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

const ProductCatalog = ({ searchQuery = '', setAllTags, selectedTags }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredProducts = useMemo(() => {
    if (searchQuery && selectedTags?.length > 0) {
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
    } else if (selectedTags?.length > 0) {
      return products.filter((product) => {
        return selectedTags.every((tag) => product.tags?.includes(tag));
      });
    } else {
      return products;
    }
  }, [products, searchQuery, selectedTags]);


  useEffect(() => {
    if (!products?.length) {
      fetchProducts();
    }
  }, [])

  const getUniqueProductTags = (products = []) => {
    const uniqueTags = new Set();

    products.forEach(product => {
      const tags = product.tags?.split(',')?.map(tag => tag?.trim());
      tags.forEach(tag => uniqueTags.add(tag));
    });

    return Array.from(uniqueTags);
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/product`);
      const data = response.data;
      const catalogProducts = data.Products.filter(product => product.catalog_id !== undefined && product.catalog_id !== null && product.status === 'ENABLED');
      setProducts(catalogProducts);
      const allTags = getUniqueProductTags(catalogProducts);
      setAllTags(allTags);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    <div className="product-catalog">
      {filteredProducts?.map((product) => (
        <a className="product-card-link" href={`/product/detail?id=${product.id_product}`} key={product.id}>
          <ProductCard
            imageSrc={product.image || '/images/unavailable.png'}
            title={product.title}
            price={product.price}
            isOutOfStock={product.is_out_of_stock}
          />
        </a>
      ))}
    </div>
  );
};

export default memo(ProductCatalog);
