import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import { Button, Switch } from '@mui/material';
import { Box } from '@mui/system';
import DetailsModal from '../../../src/utils/modals/product_modal/DetailsModal';
import EditModal from '../../../src/utils/modals/product_modal/EditModal';
import CreateModal from '../../../src/utils/modals/product_modal/CreateModal';
import Head from 'next/head';
import Storefront from "@mui/icons-material/Storefront";
import { getAllProducts, modifyProduct, createProduct } from '../../../services/productService';
import { Card, CardContent, CardMedia, CardActions } from '@mui/material';
import { styled } from '@mui/system';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    getAllProducts()
      .then(products => {
        setProducts(products);
        setLoading(false);
      });
  }, []);

  const editProduct = (editedProduct) => {
    modifyProduct(editedProduct)
      .then((updatedProduct) => {
        setProducts(products.map(product => product.id_product === updatedProduct.id_product
          ? { ...product, ...updatedProduct }
          : product));
        setEditModalOpen(false);
      })
  }

  const newProduct = (newProductData) => {
    createProduct(newProductData)
      .then(() => {
        handleCloseCreateModal();
        getAllProducts()
          .then(products => {
            setProducts(products);
            setLoading(false);
          });
      })
  }

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleInputChange = (event) => {
    setProductToEdit({
      ...productToEdit,
      [event.target.name]: event.target.value
    });
  };

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleProductStatus = async (targetProduct) => {
    const newStatus = targetProduct.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    const editedProduct = { ...targetProduct, status: newStatus };
    modifyProduct(editedProduct).then(() => {
      setProducts(prevProducts => prevProducts.map(product => product.id_product === editedProduct.id_product ? editedProduct : product));
    });
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  const StyledCard = styled(Card)(({ theme, status }) => ({
    borderRadius: '10px',
    borderColor: status === 'ENABLED' ? 'brown' : 'lightgrey',
    marginBottom: theme.spacing(2),
    background: status === 'ENABLED' ? 'white' : 'lightgrey',
  }));

  const ProductContainer = styled('div')({
    maxHeight: '100%',
    overflowY: 'auto',
  });

  const InvertedButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    backgroundColor: '#ffff',
    color: 'rgb(216, 130, 130)',
    borderColor: 'rgb(216, 130, 130)',
    '&:hover': {
      backgroundColor: 'rgb(216, 130, 130)',
      color: 'white',
      borderColor: 'rgb(216, 130, 130)',
    },
  }));

  const StyledButton = styled(Button)(({ theme, status }) => ({
    borderRadius: '10px',
    borderColor: status === 'ENABLED' ? 'rgb(216, 130, 130)' : 'lightgrey',
    backgroundColor: status === 'ENABLED' ? 'white' : 'lightgrey',
    color: status === 'ENABLED' ? 'rgb(216, 130, 130)' : 'grey',
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
    '&:hover': {
      borderColor: status === 'ENABLED' ? 'white' : 'grey',
      backgroundColor: status === 'ENABLED' ? 'rgb(216, 130, 130)' : 'lightgrey',
      color: 'white'
    },
  }));

  return (
    <Layout>
      <Head style={{ marginBottom: '10px' }}>
        <title>Productos</title>
      </Head>
      <div className="title-container">
        <h1><Storefront className="icon-title" />Productos</h1>
      </div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <InvertedButton variant="outlined" onClick={handleOpenCreateModal}>Nuevo producto</InvertedButton>
      </Box>
      <ProductContainer>
        {products.map((product) => (
          <StyledCard elevation={3} key={product.id_product} status={product.status}>
            <Box display="flex">
              <CardMedia
                component="img"
                image={product.image ? product.image : '/images/unavailable.png'}
                alt={product.title}
                style={{ width: '300px' }}
              />
              <CardContent>
                <h1>{product.title}</h1>
                <span className="product-price">${product.price}</span>
                <CardActions style={{ padding: 0 }}>
                  <StyledButton
                    status={product.status}
                    variant="outlined"
                    onClick={() => handleOpen(product)}
                  >
                    Ver detalles
                  </StyledButton>

                  {selectedProduct ? (
                    <DetailsModal open={open} handleClose={handleClose} data={selectedProduct} />
                  ) : null}

                  <StyledButton
                    status={product.status}
                    variant="outlined"
                    onClick={() => { setProductToEdit(product); setEditModalOpen(true); }}
                  >
                    Editar producto
                  </StyledButton>
                  <Switch checked={product.status === 'ENABLED'} onChange={() => toggleProductStatus(product)} />
                  {product.status === 'ENABLED' ? <span>En Stock</span> : <span>Sin Stock</span>}
                </CardActions>
              </CardContent>
            </Box>
          </StyledCard>
        ))}
      </ProductContainer>
      {editModalOpen ? (
        <EditModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          data={productToEdit}
          handleInputChange={handleInputChange}
          handleUpdate={editProduct}
        />
      ) : null}
      {isCreateModalOpen ? (
        <CreateModal
          open={isCreateModalOpen}
          handleClose={handleCloseCreateModal}
          handleAdd={newProduct}
        />
      ) : null}
    </Layout>
  );
};

export default Products;