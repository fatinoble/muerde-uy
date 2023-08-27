import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select } from '@mui/material';
import {UNIT_MEASURES} from '../../../../src/utils'

const AddDialog = ({ fetchIngredients }) => {
  const [existingIngredientError, setexistingIngredientError] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    unit: '',
  });

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setexistingIngredientError('');
    setNewIngredient({
      name: '',
      unit: '',
    });
  };

  const handleAddIngredient = async () => {
    const existIngredient = await validateExistingIngredient(newIngredient)
    if (!existIngredient) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient`, {
          ingredient: newIngredient,
        });
        fetchIngredients();
        handleCloseAddModal();
      } catch (error) {
        console.error('Error adding ingredient:', error);
      }
    } else {
      setexistingIngredientError('Ya existe un ingrediente con ese nombre');
    }
  };

  const validateExistingIngredient = async (newIngredient) => {
    const ingredients = await fetchIngredients();
    if (ingredients) { 
      const existingIngredient = ingredients.find(ing => ing.name === newIngredient.name);
      return existingIngredient != undefined;
    }
    return false; 
  };  

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>Agregar nuevo ingrediente</Button>

      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Agregar nuevo ingrediente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Complete los campos para agregar un nuevo ingrediente:
          </DialogContentText>
          <TextField
            label="Nombre"
            value={newIngredient.name}
            onChange={(e) => {
              const value = e.target.value;          
              if (/^[a-zA-Z\s]*$/.test(value)) {
                setNewIngredient((prevIngredient) => ({
                  ...prevIngredient,
                  name: value,
                }));
              }
            }}
            fullWidth
            margin="normal"
            variant="outlined"
            helperText={existingIngredientError}
          />
          <Select
            label="Unidad"
            value={newIngredient.unit}
            onChange={(e) =>
              setNewIngredient((prevIngredient) => ({
                ...prevIngredient,
                unit: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
          >
            {UNIT_MEASURES.map((unitMeasure) => (
              <MenuItem key={unitMeasure.key} value={unitMeasure.key}>
                {unitMeasure.text}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddIngredient} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddDialog;
