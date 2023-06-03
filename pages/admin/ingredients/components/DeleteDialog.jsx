import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const DeleteDialog = ({ handleConfirmDelete, openDeleteModal, setOpenDeleteModal, }) => {

  return (
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
  );
};

export default DeleteDialog;
