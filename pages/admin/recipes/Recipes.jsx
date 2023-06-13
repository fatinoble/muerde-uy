import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Paper, Switch } from '@mui/material';
import { styled } from '@mui/system';
import DetailsModal from '../../general/modals/DetailsModal';
import EditModal from '../../general/modals/EditModal';
import DeleteModal from '../../general/modals/DeleteModal';
import UnitConverter from '../../general/units_converter/UnitConverter';
import { getAllRecipes } from '../../../services/recipeService';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [open, setOpen] = useState(false); // Controla si el modal está abierto o no
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Para almacenar la receta seleccionada para mostrar en el modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  /* Todas las recetas a recorrer */
  useEffect(() => {
    getAllRecipes()
    .then(recipes => {
      console.log("then", recipes)
      setRecipes(recipes);
    });
  }, []);

  /* Modal de ver detalles */
  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /* Editar receta */

  /* Los nuevos datos resultado de editar una receta*/
  const editRecipe = (editedRecipe) => {
    console.log("edited recipe ", editedRecipe); // Añadir esta línea
    axios.put(`http://localhost:8000/recipe?id=${editedRecipe.id_recipe}`, { recipe: editedRecipe }) 
    .then(response => {
        console.log("response en edit receta: ", response);
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe.id === editedRecipe.id ? editedRecipe : recipe
          )
        );
        setEditModalOpen(false); // Cerrar el modal después de editar
      })
      .catch(error => console.error('Error:', error));
  }  

  const handleInputChange = (event) => {
    setRecipeToEdit({
      ...recipeToEdit,
      [event.target.name]: event.target.value
    });
  };

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

  return (
    <Layout>
      {recipes.map((recipe) => (
        <ProductPaper elevation={3} key={recipe.id}>
          <div className="image-name-container">
            <img src={recipe.product.image} alt="Product Image" />
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
        handleInputChange={handleInputChange}
        handleUpdate={editRecipe}
        title={"Editar receta"}
      />
    </Layout>
  );
};

export default Recipes;
