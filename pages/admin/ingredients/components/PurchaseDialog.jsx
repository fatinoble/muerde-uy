import { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { Tooltip } from '@mui/material';
import { UNIT_MEASURES_CONVERTER, calculateQuantity } from '@/utils/units_converter/helper';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const PurchaseDialog = ({ fetchIngredients, ingredient }) => {

  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [ingredientUnit, setIngredientUnit] = useState(ingredient?.unit?.toLowerCase());
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
      const finalPurchase = { ...newPurchase };
      if (ingredient?.unit !== 'UN' && ingredient?.unit !== 'un') {
        finalPurchase.quantity = calculateQuantity(ingredientUnit, newPurchase.quantity);
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient/purchase`, {
        purchase_ingredient: finalPurchase,
      });
      fetchIngredients();
      handleClosePurchaseodal();
    } catch (error) {
      console.error('Error purchasing ingredient:', error);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        className="action-button"
        color="primary"
        onClick={() => setOpenPurchaseModal(true)}
        style={{ color: 'white', backgroundColor: 'rgba(216, 130, 130, 0.737)', marginRight: '10px' }}
        startIcon={<ShoppingCartIcon style={{ color: 'white' }} />}
      >
        Registrar compra
      </Button>

      <Dialog open={openPurchaseModal} onClose={handleClosePurchaseodal}>
        <DialogTitle>{`Registrar compra de ${ingredient?.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Complete los campos para registrar la compra:
          </DialogContentText>


          <div style={{ justifyContent: 'space-between' }}>
            <TextField
              label="Cantidad"
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
            >
            </TextField >

            <Tooltip title="Todo se guarda en gramos menos las unidades" placement="right">
              <Select
                label="Unidad"
                value={ingredientUnit}
                onChange={(event) => setIngredientUnit(event.target.value)}
              >
                {
                  ingredient?.unit === 'UN' ?
                    <MenuItem value="UN">Unidad/es</MenuItem> :
                    UNIT_MEASURES_CONVERTER.map((unitOption) => (
                      <MenuItem key={unitOption.key} value={unitOption.key}>{unitOption.text}</MenuItem>
                    ))
                }
              </Select>
            </Tooltip>
          </div>


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
