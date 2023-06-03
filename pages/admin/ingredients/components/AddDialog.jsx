import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

const AddDialog = ({ setNewIngredient, handleCloseAddModal, handleAddIngredient, openAddModal, newIngredient }) => {

  return (
   
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
      <TextField
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
      />
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
  );
};

export default AddDialog;
