import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../../../src/components/UserLayout';
import ProductCatalog from './components/ProductCatalog';
import ServiceCatalog from './components/ServiceCatalog';
import Search from './components/Search';
import TagFilter from './components/TagFilter';
import WhatsAppButton from '../../../src/components/WhatsAppButton';
import { ToggleButton, ToggleButtonGroup, Grid, Button } from '@mui/material';

//TODO: Manejar user con lógica de usuario
const user = {name: 'Pedro'}

const Catalog = () => {
  const [selectedCatalog, setSelectedCatalog] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCatalogTypeChange = (event, newCatalogType) => {
    if (newCatalogType) {
      setSearchQuery('');
      setSelectedCatalog(newCatalogType);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const whatsappCatalogMessage = `!Hola! Soy ${user.name}, y quisiera saber un poco más sobre los productos en Muerde.`;

  return (
    <Layout>
            <Head>
        <title>Catálogo</title>
      </Head>
      <Grid container spacing={2} alignItems="center" className="catalog-main-container">
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
        <Grid sx={{ textAlign: 'left', width: '50%', marginLeft: '20px' }}>
          <Search handleSearchChange={handleSearchChange} searchQuery={searchQuery} />

          {selectedCatalog === 'products' && (
            <>
              <TagFilter allTags={allTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleClearFilters()}
                sx={{
                  borderRadius: '1rem',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  backgroundColor: '#A87658'
                }}
              >
                Limpiar
              </Button>
            </>
          )
          }
          <WhatsAppButton message={whatsappCatalogMessage} />
        </Grid>
      </Grid>

      <div className="catalogs-container">
        {selectedCatalog === 'products'
          ? <ProductCatalog searchQuery={searchQuery} setAllTags={setAllTags} selectedTags={selectedTags} />
          : <ServiceCatalog searchQuery={searchQuery} />}
      </div>
    </Layout>
  );
};

export default Catalog;
