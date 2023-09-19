import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import { Button, Switch, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import DetailsModal from '../../../src/utils/modals/product_modal/DetailsModal';
import EditModal from '../../../src/utils/modals/product_modal/EditModal';
import CreateModal from '../../../src/utils/modals/product_modal/CreateModal';
import Head from 'next/head';
import Storefront from "@mui/icons-material/Storefront";
import { getAllProducts, modifyProduct, createProduct } from '../../../services/productService';
import { Card, CardContent, CardMedia, CardActions } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';
import { verifyToken } from '../../../services/userService';
import { getAllRecipes } from '../../../services/recipeService';
import CircularProgress from '@mui/material/CircularProgress';

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const anyRecipeWithoutProduct = recipes.some(recipe => recipe.product === null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token_admin');
        const response = await verifyToken(token);
        const user = response.data;
        if (!user.id_user || user.role !== 'ADMIN') {
          router.push('/admin/login');
        } else {
          getAllProducts()
            .then(products => {
              setProducts(products);
              setLoading(false);
            });
          getAllRecipes()
            .then(recipes => {
              setRecipes(recipes);
            });
            setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();

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
    getAllRecipes()
      .then(recipes => {
        setRecipes(recipes);
      });
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <Layout>
      <Head style={{ marginBottom: '10px' }}>
        <title>Productos</title>
      </Head>
      <div className="title-container">
        <h1><Storefront className="icon-title" />Productos</h1>
      </div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Tooltip title={anyRecipeWithoutProduct ? "" : "No hay recetas disponibles para asociar a un nuevo producto, crea una receta primero"}>
          <span>
            <InvertedButton
              variant="outlined"
              onClick={handleOpenCreateModal}
              disabled={!anyRecipeWithoutProduct}
            >
              Nuevo producto
            </InvertedButton>
          </span>
        </Tooltip>
        {!anyRecipeWithoutProduct && (
          <InvertedButton
            variant="outlined"
            color="secondary"
            onClick={() => router.push('/admin/recipes')}
          >
            Ir a recetas
          </InvertedButton>
        )}
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
                <Tooltip title={product.is_out_of_stock == true ? 'Por no tener stock de ingredientes, no está disponible para la venta.' : ''}>
                  <h2 style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    width: 'fit-content',
                    backgroundColor: product.is_out_of_stock == false ? 'rgb(216, 130, 130)' : 'grey',
                    color: 'white'
                  }}>
                    {product.is_out_of_stock == false ? "En stock" : "Fuera de stock"}
                  </h2>
                </Tooltip>
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
                  {product.status === 'ENABLED' ? <span>Activo</span> : <span>Inactivo</span>}
                </CardActions>
              </CardContent>
            </Box>
          </StyledCard>
        ))}
      </ProductContainer>
      {editModalOpen ? (
        <EditModal
          fetchedProducts={getAllProducts}
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          data={productToEdit}
          handleInputChange={handleInputChange}
          handleUpdate={editProduct}
        />
      ) : null}
      {isCreateModalOpen ? (
        <CreateModal
          fetchedProducts={getAllProducts}
          open={isCreateModalOpen}
          handleClose={handleCloseCreateModal}
          handleAdd={newProduct}
        />
      ) : null}
    </Layout>
  );
};

export default Products;