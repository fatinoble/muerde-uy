import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../../src/components/UserLayout';
import ProductCatalog from './components/ProductCatalog';
import ServiceCatalog from './components/ServiceCatalog';
import Search from './components/Search';
import TagFilter from './components/TagFilter';
import WhatsAppButton from '../../../src/components/WhatsAppButton';
import { ToggleButton, ToggleButtonGroup, Grid, Button } from '@mui/material';

const Catalog = () => {
  const [selectedCatalog, setSelectedCatalog] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const localStorageUserName = localStorage.getItem('user_name');
    if (localStorageUserName) {
      setUserName(localStorageUserName);
    }
  }, []);

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

  const whatsappCatalogMessage = `Hola! Soy ${userName}, y quisiera saber un poco más sobre los productos en Muerde.`;

  return (
    <Layout>
      <Head>
        <title>Catálogo</title>
      </Head>
      <div className="catalog-main-container">
        <div className="actions-container">
          <div className="actions-filter-container">
            <Search handleSearchChange={handleSearchChange} searchQuery={searchQuery} />
                <TagFilter allTags={allTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleClearFilters()}
                  sx={{
                    borderRadius: '1rem',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    backgroundColor: '#E28D8D'
                  }}
                >
                  Limpiar
                </Button>
          </div>

          <div className="catalog-switch-container">
            <ToggleButtonGroup
              className="catalog-switch-toggle"
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
          </div>
          <div>
            <WhatsAppButton message={whatsappCatalogMessage} />
          </div>
        </div>

        <div className="catalogs-container">
          {selectedCatalog === 'products'
            ? <ProductCatalog searchQuery={searchQuery} setAllTags={setAllTags} selectedTags={selectedTags} />
            : <ServiceCatalog searchQuery={searchQuery} setAllTags={setAllTags} selectedTags={selectedTags} />}
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
