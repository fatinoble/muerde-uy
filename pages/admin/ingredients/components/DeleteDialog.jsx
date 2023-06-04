import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';

const DeleteDialog = ({ fetchIngredients, ingredientId, disabled }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    if (ingredientId) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient?id=${ingredientId}`);
        fetchIngredients();
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    }
    setOpenDeleteModal(false);
  };

  return (
    <>
      <Tooltip title={disabled ? 'No se pueden eliminar ingredientes que son utilizados en recetas' : ''}>
        <span>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenDeleteModal(true)}
            disabled={disabled}
          >
            Eliminar
          </Button>
        </span>
      </Tooltip>
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás segurx de que deseas eliminar el ingrediente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteDialog;
