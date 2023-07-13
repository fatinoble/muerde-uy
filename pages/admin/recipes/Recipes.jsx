import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect, useRef } from "react";
import { Button, Paper, Switch } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../../src/utils/modals/recipe_modal/DetailsModal';
import EditModal from '../../../src/utils/modals/recipe_modal/EditModal';
import DeleteModal from '../../../src/utils/modals/recipe_modal/DeleteModal';
import CreateModal from '../../../src/utils/modals/recipe_modal/CreateModal';
import { calculateQuantity } from '../../../src/utils/units_converter/helper';
import { getAllRecipes, modifyRecipe, deleteRecipe, createRecipe } from '../../../services/recipeService';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [open, setOpen] = useState(false); 
  const [selectedRecipe, setSelectedRecipe] = useState(null); 
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [newRecipeToAdd, setNewRecipe] = useState({});
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    getAllRecipes()
    .then(recipes => {
      setRecipes(recipes);
    });
  }, []);

  const editRecipe = (editedRecipe) => {
    modifyRecipe(editedRecipe)
      .then(() => {
        setRecipes(recipes.map(recipe => recipe.id === editedRecipe.id ? editedRecipe : recipe));
        setEditModalOpen(false);
      })
  }

  const handleOpen = (recipe) => {
    console.log("selected recipe", recipe);
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
        .then(() => {
            setRecipes((prevRecipes) => [...prevRecipes, modifiedRecipe]);
            setCreateModalOpen(false);
        });;
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
        <InvertedButton variant="outlined" onClick={handleOpenCreateModal }>Nueva receta</InvertedButton>
      </Box>
      {recipes.map((recipe) => (
        <ProductPaper elevation={3} key={recipe.id}>
          <div className="image-name-container">
            {/* <img src={recipe.product.image} alt="Product Image" /> */}
            <h1 className="recipe-name"> {recipe.name} </h1>
          </div>
          <div className="recipe-admin-actions-container">
            <StyledButton variant="outlined" onClick={() => handleOpen(recipe)}>
              Ver detalles
            </StyledButton>
            { selectedRecipe ? ( 
              <DetailsModal open={open} handleClose={handleClose} data={selectedRecipe} />
            ) : null }
            <StyledButton variant="outlined" onClick={() => { setRecipeToEdit(recipe); setEditModalOpen(true); }}>
              Editar receta
            </StyledButton>
            <StyledButton variant="outlined" onClick={() => { showDeleteModal(recipe) }}>Eliminar receta</StyledButton>
          </div>
        </ProductPaper>
      ))}
      { editModalOpen ? (
        <EditModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          data={recipeToEdit}
          handleInputChange={handleInputChange}
          handleUpdate={editRecipe}
        />
      ) : null}
      { deleteModalOpen ? (
        <DeleteModal
          open={deleteModalOpen}
          handleClose={() => setDeleteModalOpen(false)}
          data={recipeToDelete}
          handleDelete={removeRecipe}
        />
      ) : null}
      { isCreateModalOpen ? (
        <CreateModal
          open={isCreateModalOpen}
          handleClose={handleCloseCreateModal}
          handleAdd={newRecipe}
        />
      ) : null}
    </Layout>
  );
};

export default Recipes;
