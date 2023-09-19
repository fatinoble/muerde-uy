import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect, useRef } from "react";
import { Button, Paper } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../../src/utils/modals/recipe_modal/DetailsModal';
import EditModal from '../../../src/utils/modals/recipe_modal/EditModal';
import DeleteModal from '../../../src/utils/modals/recipe_modal/DeleteModal';
import CreateModal from '../../../src/utils/modals/recipe_modal/CreateModal';
import { calculateQuantity } from '../../../src/utils/units_converter/helper';
import Head from 'next/head';
import RestaurantMenu from "@mui/icons-material/RestaurantMenu";
import { getAllRecipes, getSingleRecipe, modifyRecipe, deleteRecipe, createRecipe } from '../../../services/recipeService';
import { useRouter } from 'next/router';
import { Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { verifyToken } from '../../../services/userService';
import CircularProgress from '@mui/material/CircularProgress';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token_admin');
        const response = await verifyToken(token);
        const user = response.data;
        if (!user.id_user || user.role !== 'ADMIN') {
          router.push('/admin/login');
        } else {
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

  const editRecipe = (editedRecipe) => {
    modifyRecipe(editedRecipe)
      .then(() => {
        setRecipes(recipes.map(recipe => recipe.id_recipe === editedRecipe.id_recipe ? editedRecipe : recipe));
        setEditModalOpen(false);
      })
  }

  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleInputChange = (event) => {
    setRecipeToEdit({
      ...recipeToEdit,
      [event.target.name]: event.target.value
    });
  };

  const removeRecipe = (recipe) => {
    deleteRecipe(recipe)
      .then(() => {
        setRecipes(prevRecipes => prevRecipes.filter(r => r.id_recipe !== recipe.id_recipe));
        setDeleteModalOpen(false);
      })
  }

  const newRecipe = (recipe) => {
    const modifiedRecipe = JSON.parse(JSON.stringify(recipe));

    modifiedRecipe.ingredients = modifiedRecipe.ingredients.map(ingredient => {
      const newQuantity = calculateQuantity(ingredient.unit, ingredient.quantity);
      return {
        ...ingredient,
        quantity: newQuantity,
        unit: undefined,
      };
    });

    createRecipe(modifiedRecipe)
      .then((newRecipe) => {
        const newRecipeId = newRecipe.id_recipe;
        getSingleRecipe(newRecipeId)
          .then((completeNewRecipe) => {
            setRecipes((prevRecipes) => [...prevRecipes, completeNewRecipe]);
          });
        setCreateModalOpen(false);
      });
  };

  const showDeleteModal = (recipe) => {
    setRecipeToDelete(recipe);
    setDeleteModalOpen(true);
  }

  const ProductPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '10px',
    borderColor: 'brown',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '10px',
    borderColor: 'rgb(216, 130, 130)',
    backgroundColor: 'white',
    color: 'rgb(216, 130, 130)',
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgb(216, 130, 130)',
      color: 'white',
      borderColor: 'white',
    },
  }));

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
        <title>Recetas</title>
      </Head>
      <div className="title-container">
        <h1><RestaurantMenu className="icon-title" />Recetas</h1>
      </div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <InvertedButton variant="outlined" onClick={handleOpenCreateModal}>Nueva receta</InvertedButton>
      </Box>
      {recipes.map((recipe) => (
        <ProductPaper elevation={3} key={recipe.id}>
          <div className="name-container">
            <h1 className="recipe-name"> {recipe.name} </h1>
          </div>
          <div className="recipe-admin-actions-container" style={{ display: 'flex', alignItems: 'center' }}>
            <StyledButton variant="outlined" onClick={() => handleOpen(recipe)}>
              Ver detalles
            </StyledButton>
            {selectedRecipe ? (
              <DetailsModal open={open} handleClose={handleClose} data={selectedRecipe} />
            ) : null}
            <StyledButton variant="outlined" onClick={() => { setRecipeToEdit(recipe); setEditModalOpen(true); }}>
              Editar receta
            </StyledButton>
            <Tooltip title={recipe.product ? "Esta receta no puede ser eliminada porque está asociada al producto " + recipe.product.title : ""}>
              <span>
                <StyledButton
                  variant="outlined"
                  onClick={() => { showDeleteModal(recipe) }}
                  disabled={recipe.product}
                >
                  Eliminar receta
                </StyledButton>
              </span>
            </Tooltip>
            {!recipe.product ? (
              <Tooltip title="Esta receta no se encuentra asociada a ningún producto">
                <StyledButton variant="outlined" onClick={() => router.push('/admin/products')}>
                  Crear producto
                </StyledButton>
              </Tooltip>
            ) : (
              null
            )}
          </div>
        </ProductPaper>
      ))}
      {editModalOpen ? (
        <EditModal
          fetchedRecipes={getAllRecipes}
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          data={recipeToEdit}
          handleInputChange={handleInputChange}
          handleUpdate={editRecipe}
        />
      ) : null}
      {deleteModalOpen ? (
        <DeleteModal
          open={deleteModalOpen}
          handleClose={() => setDeleteModalOpen(false)}
          data={recipeToDelete}
          handleDelete={removeRecipe}
        />
      ) : null}
      {isCreateModalOpen ? (
        <CreateModal
          fetchedRecipes={getAllRecipes}
          open={isCreateModalOpen}
          handleClose={handleCloseCreateModal}
          handleAdd={newRecipe}
        />
      ) : null}
    </Layout>
  );
};

export default Recipes;
