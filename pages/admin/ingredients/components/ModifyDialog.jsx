import { useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, MenuItem, Select } from '@mui/material';
import { getApiUrl } from '../../../../services/utils';

const ModifyDialog = ({ fetchIngredients, ingredient = {} }) => {
  const [existingIngredientError, setexistingIngredientError] = useState('');
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [modifyIngredient, setModifyIngredient] = useState({
    name: ingredient.name,
  });

  const handleCloseModifyModal = () => {
    setOpenModifyModal(false);
    setexistingIngredientError('');
    setModifyIngredient({
      name: ingredient.name,
    });
  };

  const handleModifyIngredient = async () => {
    const existIngredient = await validateExistingIngredient(modifyIngredient)
    if (!existIngredient) {
      try {
        await axios.put(`${getApiUrl()}/ingredient?id=${ingredient?.id_ingredient}`, {
          ingredient: modifyIngredient,
        });
        fetchIngredients();
        handleCloseModifyModal();
      } catch (error) {
        console.error('Error modifying ingredient:', error);
      }
    } else {
      setexistingIngredientError('Ya existe un ingrediente con ese nombre');
    }
  };
  const validateExistingIngredient = async (modifyIngredient) => {
    const ingredients = await fetchIngredients();
    if (ingredients) {
      const existingIngredient = ingredients.find(ing => ing.name.toLowerCase() === modifyIngredient.name.toLowerCase());
      return existingIngredient != undefined;
    }
    return false;
  };

  return (
    <>
      <Button variant="outlined" className="action-button" color="primary" style={{ color: 'white', backgroundColor: 'rgba(216, 130, 130, 0.737)', marginRight: '10px' }} onClick={() => setOpenModifyModal(true)}>
        <EditIcon style={{ color: 'white' }}></EditIcon>
      </Button>

      <Dialog open={openModifyModal} onClose={handleCloseModifyModal}>
        <DialogTitle>{`Modificar ingrediente ${ingredient.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edite el nombre para modificarlo:
          </DialogContentText>
          <TextField
            label="Nombre"
            value={modifyIngredient.name}
            inputProps={{ maxLength: 50 }}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-ZáéíóúÁÉÍÓÚ\s]*$/.test(value)) {
                setModifyIngredient((prevIngredient) => ({
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
