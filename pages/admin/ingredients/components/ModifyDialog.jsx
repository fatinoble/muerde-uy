import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select } from '@mui/material';

const ModifyDialog = ({ fetchIngredients, ingredient = {} }) => {

  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [modifyIngredient, setModifyIngredient] = useState({
    name: ingredient.name,
  });

  const handleCloseModifyModal = () => {
    setOpenModifyModal(false);
    setModifyIngredient({
      name: ingredient.name,
    });
  };

  const handleModifyIngredient = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient?id=${ingredient?.id_ingredient}`, {
        ingredient: modifyIngredient,
      });
      fetchIngredients();
      handleCloseModifyModal();
    } catch (error) {
      console.error('Error modifying ingredient:', error);
    }
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpenModifyModal(true)}>Modificar</Button>

      <Dialog open={openModifyModal} onClose={handleCloseModifyModal}>
        <DialogTitle>{`Modificar ingrediente ${ingredient.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edite los campos del ingrediente para modificarlos:
          </DialogContentText>
          <TextField
            label="Nombre"
            value={modifyIngredient.name}
            onChange={(e) => {
              const value = e.target.value;          
              if (/^[a-zA-Z\s]*$/.test(value)) {
                setModifyIngredient((prevIngredient) => ({
                  ...prevIngredient,
                  name: value,
                }));
              }
            }}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModifyModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleModifyIngredient} color="primary">
            Modificar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModifyDialog;
