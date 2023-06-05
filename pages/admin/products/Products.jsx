import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import SearchBar from '../../general/search_bar/SearchBar';
import { Button, Paper, Switch } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../general/modals/DetailsModal';
import EditModal from '../../general/modals/EditModal';

const Products = () => {
  const [products, setProducts] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // Controla si el modal está abierto o no
  const [selectedProduct, setSelectedProduct] = useState(null); // Para almacenar el producto seleccionado para mostrar en el modal

  /* Todos los productos a recorrer */
  useEffect(() => {
    fetch(`http://localhost:8000/product`)
      .then(response => response.json())
      .then(data => {
        console.log("los productos del fetch ", data);
        setProducts(data.Products);
        setLoading(false);
      });
  }, []);

  /* Los nuevos datos resultado de editar un producto*/
  const editProduct = (editedProduct) => {
    console.log("edited product ", editedProduct); // Añadir esta línea
    // Convertir el precio al formato correcto hasta poder arreglar errro en backend
    if(editedProduct.price && Array.isArray(editedProduct.price.d)) {
      editedProduct.price = editedProduct.price.d[0];
    }
    axios.put(`http://localhost:8000/product?id=${editedProduct.id_product}`, { product: editedProduct }) // en el controlador esperamos los dayos dentro de un objeto product
    .then(response => {
        console.log("response en edit product: ", response);
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === editedProduct.id ? editedProduct : product
          )
        );
        setEditModalOpen(false); // Cerrar el modal después de editar
      })
      .catch(error => console.error('Error:', error));
  }

  const handleInputChange = (event) => {
    setProductToEdit({
      ...productToEdit,
      [event.target.name]: event.target.value
    });
  };

  /*const deleteProduct = () => {
    axios.delete(`http://localhost:8000/product/${id}`) // Verificar
      .then(response => {
        console.log(response);
        // Aquí puedes redirigir al usuario, actualizar el estado global, etc.
        setDeleteModalOpen(false); // Cerrar el modal después de eliminar
      })
      .catch(error => console.error('Error:', error));
  }*/

  /* Modal de ver detalles */

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

  /* Estilos */

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
              title={"Detalle del producto"}
            />
            <StyledButton
              variant="outlined"
              onClick={() => {
                setProductToEdit(product);
                setEditModalOpen(true);
              }}
            >
              Editar producto
            </StyledButton>
            <StyledButton variant="outlined" onClick={() => setDeleteModalOpen(true)}>Eliminar producto</StyledButton>
            <Switch onChange={() => {/* Acción de desactivar/activar producto */ }} />
          </div>
        </ProductPaper>
      ))}
      <EditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        data={productToEdit} // En lugar de product={productToEdit}
        handleInputChange={handleInputChange}
        handleUpdate={editProduct}
      />
    </Layout>
  );
};

export default Products;
