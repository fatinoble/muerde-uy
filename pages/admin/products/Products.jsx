import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import { Button, Paper, Switch } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../../src/utils/modals/product_modal/DetailsModal';
import EditModal from '../../../src/utils/modals/EditModal';
import DeleteModal from '../../../src/utils/modals/product_modal/DeleteModal';
import CreateModal from '../../../src/utils/modals/product_modal/CreateModal';
import { getAllProducts, modifyProduct, deleteProduct, createProduct } from '../../../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
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
      .then(() => {
        setProducts(products.map(product => product.id === editedProduct.id ? editedProduct : product));
        setEditModalOpen(false);
      })
  }

  const removeProduct = (product) => {
    deleteProduct(product)
      .then(() => {
        setProducts(prevProducts => prevProducts.filter(p => p.id_product !== product.id_product));
        setDeleteModalOpen(false);
      })
  }

  const newProduct = (newProductData) => {
    createProduct(newProductData)
      .then(() => {
        setNewProductData(newProductData);
        handleCloseCreateModal();
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
    const newStatus = targetProduct.status === 'ENABLED' ? 'DISABLE' : 'ENABLED';
    const editedProduct = { ...targetProduct, status: newStatus };
    modifyProduct(editedProduct).then(() => {
      setProducts(prevProducts => prevProducts.map(product => product.id_product === editedProduct.id_product ? editedProduct : product));
    });
  };

  const showDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
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
        <InvertedButton variant="outlined" onClick={handleOpenCreateModal}>Nuevo producto</InvertedButton>
      </Box>
      {products.map((product) => (
        <ProductPaper elevation={3} key={product.id_product}>
          <div className="small-image-container">
            <img className="product-image-small" src={product.image} alt={product.title}></img>
          </div>
          <div className="price-name-container">
            <h1 className="product-name"> {product.title} </h1>
            <span className="product-price">{product.price}</span>
          </div>
          <div className="product-admin-actions-container">
            <StyledButton variant="outlined" onClick={() => handleOpen(product)}>
              Ver detalles
            </StyledButton>
            { selectedProduct ? ( 
              <DetailsModal open={open} handleClose={handleClose} data={selectedProduct} />
            ) : null }
            <StyledButton variant="outlined" onClick={() => { setProductToEdit(product); setEditModalOpen(true); }}>
              Editar producto
            </StyledButton>
            <StyledButton variant="outlined" onClick={() => { showDeleteModal(product) }}>Eliminar producto</StyledButton>
            <Switch checked={product.status === 'ENABLED'} onChange={() => toggleProductStatus(product)} />
          </div>
        </ProductPaper>
      ))}
      <EditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        data={productToEdit}
        dataType={"product"}
        handleInputChange={handleInputChange}
        handleUpdate={editProduct}
        title={"Editar producto"}
      />
      {deleteModalOpen ? (
        <DeleteModal
          open={deleteModalOpen}
          handleClose={() => setDeleteModalOpen(false)}
          data={productToDelete}
          handleDelete={removeProduct}
        />
      ) : null}
      <CreateModal
        open={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        handleAdd={newProduct}
      />
    </Layout>
  );
};

export default Products;
