import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import { Button, Paper, Switch } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../../src/utils/modals/product_modal/DetailsModal';
import EditModal from '../../../src/utils/modals/product_modal/EditModal';
import CreateModal from '../../../src/utils/modals/product_modal/CreateModal';
import Head from 'next/head';
import Storefront from "@mui/icons-material/Storefront";
import { getAllProducts, modifyProduct, createProduct } from '../../../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProductData, setNewProductData] = useState({});
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
        setNewProductData(newProductData);
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

  const ProductPaper = styled(Paper)(({ theme, status }) => ({
    borderRadius: '10px',
    borderColor: status === 'ENABLED' ? 'brown' : 'lightgrey',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    background: status === 'ENABLED' ? 'white' : 'lightgrey',
    color: status === 'ENABLED' ? '#black' : 'grey'
  }));

  const StyledButton = styled(Button)(({ theme, status }) => ({
    borderRadius: '10px',
    borderColor: status === 'ENABLED' ? 'beige' : 'lightgrey',
    backgroundColor: status === 'ENABLED' ? '#f1e5d5' : 'lightgrey',
    color: status === 'ENABLED' ? 'black' : 'grey',
    '&:hover': {
      borderColor: status === 'ENABLED' ? 'brown' : 'grey',
      backgroundColor: status === 'ENABLED' ? 'fff' : 'lightgrey',
    },
  }));

  const InvertedButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    backgroundColor: 'beige',
    backgroundColor: '#ffff',
    color: 'black',
    borderColor: 'black',
    '&:hover': {
      backgroundColor: 'f1e5d5',
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
      {products.map((product) => (
        <ProductPaper elevation={3} key={product.id_product} status={product.status}>
          <div className="small-image-container">
            <img
              className="product-image-small"
              src={product.image ? product.image : '/images/unavailable.png'} alt={product.title}
              style={{ width: '300px' }}
            ></img>
          </div>
          <div className="price-name-container">
            <h1 className="product-name"> {product.title} </h1>
            <span className="product-price">${product.price}</span>
          </div>
          <div className="product-admin-actions-container">
            <StyledButton status={product.status} variant="outlined" onClick={() => handleOpen(product)}>
              Ver detalles
            </StyledButton>
            {selectedProduct ? (
              <DetailsModal open={open} handleClose={handleClose} data={selectedProduct} />
            ) : null}
            <StyledButton status={product.status} variant="outlined" onClick={() => { setProductToEdit(product); setEditModalOpen(true); }}>
              Editar producto
            </StyledButton>
            <Switch checked={product.status === 'ENABLED'} onChange={() => toggleProductStatus(product)} />
            {product.is_out_of_stock ? <span>Sin Stock</span> : <span>En Stock</span>}
          </div>
        </ProductPaper>
      ))}
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
