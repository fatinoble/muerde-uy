import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

const PurchaseDialog = ({ fetchIngredients, ingredient }) => {

  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    quantity: 0,
    cost: 0,
    ingredient_id: ingredient?.id_ingredient
  });

  const handleClosePurchaseodal = () => {
    setOpenPurchaseModal(false);
    setNewPurchase({
      quantity: 0,
      cost: 0,
      ingredient_id: ingredient?.id_ingredient
    });
  };

  const handlePurchaseIngredient = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient/purchase`, {
        purchase_ingredient: newPurchase,
      });
      fetchIngredients();
      handleClosePurchaseodal();
    } catch (error) {
      console.error('Error purchasing ingredient:', error);
    }
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpenPurchaseModal(true)}>Registrar compra</Button>

      <Dialog open={openPurchaseModal} onClose={handleClosePurchaseodal}>
        <DialogTitle>{`Registrar compra de ${ingredient?.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Complete los campos para registrar la compra:
          </DialogContentText>
          <TextField
            label={`Cantidad en ${ingredient.unit}`}
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={newPurchase.quantity}
            onChange={(e) =>
              setNewPurchase((prevPurchase) => ({
                ...prevPurchase,
                quantity: parseFloat(e.target.value),
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Precio en UYU"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={newPurchase.cost}
            onChange={(e) =>
              setNewPurchase((prevPurchase) => ({
                ...prevPurchase,
                cost: parseFloat(e.target.value),
              }))
            }
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePurchaseodal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handlePurchaseIngredient} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PurchaseDialog;
