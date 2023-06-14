import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Paper, Switch } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../../public/modals/DetailsModal';
import EditModal from '../../../public/modals/EditModal';
import DeleteModal from '../../../public/modals/DeleteModal';
import CreateModal from '../../../public/modals/CreateModal';
import UnitConverter from '../../../public/units_converter/UnitConverter';
import { getAllRecipes, modifyRecipe, deleteRecipe } from '../../../services/recipeService';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [open, setOpen] = useState(false); // Controla si el modal está abierto o no
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Para almacenar la receta seleccionada para mostrar en el modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [newRecipe, setNewRecipe] = useState({});
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  /* Todas las recetas a recorrer */
  useEffect(() => {
    getAllRecipes()
    .then(recipes => {
      console.log("then recipes", recipes)
      setRecipes(recipes);
    });
  }, []);

  const editRecipe = (editedRecipe) => {
    console.log("editedRecipe ", editedRecipe);
    modifyRecipe(editedRecipe)
      .then(() => {
        setRecipes(recipes.map(recipe => recipe.id === editedRecipe.id ? editedRecipe : recipe));
        setEditModalOpen(false);
      })
  }

  /* Modal de ver detalles */
  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /* Editar receta */

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
    console.log("elimianr receta ", recipe);
    deleteRecipe(recipe)
    .then(() => {
      setRecipes(prevRecipes => prevRecipes.filter(r => r.id_recipe !== recipe.id_recipe));
      setDeleteModalOpen(false);
    })
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
            <DetailsModal open={open} handleClose={handleClose} data={selectedRecipe} data_type={"recipe"} title={"Detalle de la receta"} />
            <StyledButton variant="outlined" onClick={() => { setRecipeToEdit(recipe); setEditModalOpen(true); }}>
              Editar receta
            </StyledButton>
            <StyledButton variant="outlined" onClick={() => { setRecipeToDelete(recipe); setDeleteModalOpen(true); }}>Eliminar receta</StyledButton>
          </div>
        </ProductPaper>
      ))}
      <EditModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        data={recipeToEdit}
        dataType={"recipe"}
        handleInputChange={handleInputChange}
        handleUpdate={editRecipe}
        title={"Editar receta"}
      />
      <DeleteModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        product={recipeToDelete}
        handleDelete={removeRecipe}
        title={"Eliminar receta"}
      />
      <CreateModal
        open={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        handleAdd={newRecipe}
        data_type={"recipe"}
        title="Agregar receta"
      />
    </Layout>
  );
};

export default Recipes;
