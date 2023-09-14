import { useState } from 'react';
import axios from 'axios';
import { Button, InvertedButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select } from '@mui/material';
import { UNIT_MEASURES } from '../../../../src/utils'
import { styled } from '@mui/system';
import { getApiUrl } from '../../../../services/utils';

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
        await axios.post(`${getApiUrl()}/ingredient`, {
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
      const existingIngredient = ingredients.find(ing => ing.name.toLowerCase() === newIngredient.name.toLowerCase());
      return existingIngredient != undefined;
    }
    return false;
  };

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

  return (
    <>
      <div className="add-title">
        <InvertedButton className="add-title" variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>Agregar nuevo ingrediente</InvertedButton>
      </div>

      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle >Agregar nuevo ingrediente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Complete los campos para agregar un nuevo ingrediente:
          </DialogContentText>
          <TextField
            label="Nombre"
            value={newIngredient.name}
            inputProps={{ maxLength: 50 }}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(value)) {
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
