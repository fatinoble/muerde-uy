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

  const [allServiceTags, setAllServiceTags] = useState([]);
  const [selectedServiceTags, setSelectedServiceTags] = useState([]);

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
      handleClearFilters();
      setSelectedCatalog(newCatalogType);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedServiceTags([]);
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
            < TagFilter
              allTags={selectedCatalog === 'products' ? allTags : allServiceTags}
              selectedTags={selectedCatalog === 'products' ? selectedTags : selectedServiceTags}
              setSelectedTags={selectedCatalog === 'products' ? setSelectedTags : setSelectedServiceTags} />
            <Search handleSearchChange={handleSearchChange} searchQuery={searchQuery} />

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClearFilters()}
              sx={{
                borderRadius: '1rem',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '10px',
                backgroundColor: '#E28D8D',
                marginLeft: '55px',
                marginRight: '70px'
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
              <ToggleButton value="products" aria-label="products" className="switcher-button">
                Productos
              </ToggleButton>
              <ToggleButton value="services" aria-label="services" className="switcher-button">
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
            : <ServiceCatalog searchQuery={searchQuery} setAllTags={setAllServiceTags} selectedTags={selectedServiceTags} />}
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
