import Layout from '../../../src/components/AdminLayout';
import axios from 'axios';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import DeleteDialog from './components/DeleteDialog';
import { formatDate } from '../../../src/utils';

import { useEffect, useState } from 'react';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedIngredientIdForDelete, setSelectedIngredientIdForDelete] = useState(null);


  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient`);
        const data = response.data;
        setIngredients(data.ingredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
  };
  
  const handleDelete = (ingredient) => {
    setSelectedIngredientIdForDelete(ingredient);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    console.log("estoy aca 2 ")
    if (selectedIngredientIdForDelete) {
      try {
        console.log("estoy aca")
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient?id=${selectedIngredientIdForDelete}`);
        fetchIngredients();
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    }
    setOpenDeleteModal(false);
  };


  const handleModify = (ingredient) => {
    // Handle modify logic here, such as opening a dialog or redirecting to a modify page
  };
  
  const handleAdd = () => {
    // Handle add logic here, such as opening a dialog or redirecting to an add page
  };

  const handlePurchase = () => {
    // Handle add logic here, such as opening a dialog or redirecting to an add page
  };

  const getUsageText = (count) => {
    if (count === 0) {
      return "No se encuentra vinculado a ninguna receta";
    } else if (count === 1) {
      return "Utilizado en 1 receta";
    } else {
      return `Utilizado en ${count} recetas`;
    }
  };

  return (
    <Layout>
      <div>
        <h1>Ingredientes</h1>
          <List>
    {ingredients.map((ingredient) => (
      <ListItem key={ingredient.id_ingredient}>
        <ListItemText 
          primary={ingredient.name} 
          secondary={
            <>
              {ingredient.total_quantity === 0 && (
                <span style={{ color: 'red' }}>Sin stock</span>
              )}
              {ingredient.total_quantity > 0 && ingredient.total_quantity < 0.5 && (
                <span style={{ color: 'yellow' }}>{`Stock disponible: ${ingredient.total_quantity} ${ingredient.unit}`}</span>
              )}
              {ingredient.last_purchase_date && (
                <>
                  {' • Última compra: '}
                  {formatDate(ingredient.last_purchase_date)}
                </>
              )}
              {' • '}
              {getUsageText(ingredient.recipie_using_count)}
            </>
          }
        />
        <Button variant="outlined" color="primary" onClick={() => handlePurchase(ingredient)}>Registrar compra</Button>
        <Button variant="outlined" color="primary" onClick={() => handleModify(ingredient)}>Modificar</Button>
        <Button variant="outlined" color="secondary" onClick={() => handleDelete(ingredient.id_ingredient)}>Eliminar</Button>
      </ListItem>
    ))}
  </List>

        <Button variant="contained" color="primary" onClick={handleAdd}>Agregar nuevo ingrediente</Button>

    <DeleteDialog 
    handleConfirmDelete={handleConfirmDelete} 
    openDeleteModal={openDeleteModal} 
    setOpenDeleteModal={setOpenDeleteModal}
    />
      </div>
    </Layout>
  );
  
};

export default Ingredients;
