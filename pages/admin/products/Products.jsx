import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import SearchBar from '../../general/search_bar/SearchBar';
import { Button, Paper, Switch } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../general/modals/DetailsModal';

const Products = () => {
  const [products, setProducts] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false); // Controla si el modal está abierto o no
  const [selectedProduct, setSelectedProduct] = useState(null); // Para almacenar el producto seleccionado para mostrar en el modal
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    tags: '',
    status: '',
  });

  useEffect(() => {
    fetch(`http://localhost:8000/product`)
      .then(response => response.json())
      .then(data => {
        console.log("los productos del fetch ", data);
        setProducts(data.Products);
        setLoading(false);
      });
  }, []);

  const editProduct = () => {
    axios.post(`http://localhost:8000/product/${id}`, formData)
      .then(response => {
        console.log(response);
        setProducts(response.data);
        setEditModalOpen(false); // Cerrar el modal después de editar
      })
      .catch(error => console.error('Error:', error));
  }

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const deleteProduct = () => {
    axios.delete(`http://localhost:8000/product/${id}`) // Verificar
      .then(response => {
        console.log(response);
        // Aquí puedes redirigir al usuario, actualizar el estado global, etc.
        setDeleteModalOpen(false); // Cerrar el modal después de eliminar
      })
      .catch(error => console.error('Error:', error));
  }

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  const ProductPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '10px',
    borderColor: 'brown',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    borderColor: 'beige',
    backgroundColor: '#f1e5d5',
    color: 'black',
    '&:hover': {
      backgroundColor: '#ffffff',
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
      <Box display="flex" justifyContent="center" alignItems="center">
        <SearchBar />
        <InvertedButton variant="outlined">Nuevo producto</InvertedButton>
      </Box>
      {products.map((product) => (
        <ProductPaper elevation={3} key={product.id}>
          <div className="small-image-container">
            <img className="product-image-small" src={product.image} alt={product.title}></img>
          </div>
          <div className="price-name-container">
            <h1 className="product-name"> {product.title} </h1>
            <span className="product-price">{product.price.amount}</span>
          </div>
          <div className="product-admin-actions-container">
            <StyledButton variant="outlined" onClick={() => handleOpen(product)}>
              Ver detalles
            </StyledButton>
            <DetailsModal
              open={open}
              handleClose={handleClose}
              data={selectedProduct}
            />
            <StyledButton variant="outlined" onClick={() => setEditModalOpen(true)}>Editar producto</StyledButton>
            <StyledButton variant="outlined" onClick={() => setDeleteModalOpen(true)}>Eliminar producto</StyledButton>
            <Switch onChange={() => {/* Acción de desactivar/activar producto */ }} />
          </div>
        </ProductPaper>
      ))}
    </Layout>
  );
};

export default Products;
