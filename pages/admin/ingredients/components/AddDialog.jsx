import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select } from '@mui/material';

const AddDialog = ({ fetchIngredients, unitMeasures }) => {

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    unit: '',
  });

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewIngredient({
      name: '',
      unit: '',
    });
  };

  const handleAddIngredient = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient`, {
        ingredient: newIngredient,
      });
      fetchIngredients();
      handleCloseAddModal();
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
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
            onChange={(e) =>
              setNewIngredient((prevIngredient) => ({
                ...prevIngredient,
                name: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
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
            {unitMeasures.map((unitMeasure) => (
              <MenuItem key={unitMeasure} value={unitMeasure}>
                {unitMeasure}
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
