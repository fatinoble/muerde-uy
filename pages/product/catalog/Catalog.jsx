import React, { useState } from 'react';
import Layout from '../../../src/components/UserLayout';
import ProductCatalog from './components/ProductCatalog';
import ServiceCatalog from './components/ServiceCatalog';
import Search from './components/Search';
import { ToggleButton, ToggleButtonGroup, Grid } from '@mui/material';

const Catalog = () => {
  const [selectedCatalog, setSelectedCatalog] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCatalogTypeChange = (event, newCatalogType) => {
    if (newCatalogType) {
      setSearchQuery('');
      setSelectedCatalog(newCatalogType);
    }
  };

  return (
    <Layout>
      <Grid container spacing={2} alignItems="center">
        <Grid sx={{ textAlign: 'left' }}>
          <ToggleButtonGroup
            value={selectedCatalog}
            exclusive
            onChange={handleCatalogTypeChange}
            aria-label="catalog type"
          >
            <ToggleButton value="products" aria-label="products">
              Productos
            </ToggleButton>
            <ToggleButton value="services" aria-label="services">
              Servicios
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid sx={{ textAlign: 'left', width: '50%', marginLeft: '20px'}}>
          <Search handleSearchChange={handleSearchChange} searchQuery={searchQuery} />
        </Grid>
      </Grid>

      <div>
        {selectedCatalog === 'products' ? <ProductCatalog searchQuery={searchQuery} /> : <ServiceCatalog searchQuery={searchQuery} />}
      </div>
    </Layout>
  );
};

export default Catalog;
