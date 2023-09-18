import { useState, useEffect } from 'react';
import axios from 'axios';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Tooltip, DialogTitle, TextField, MenuItem, Select } from '@mui/material';
import { getApiUrl } from '../../../../services/utils';
import InfoIcon from '../../../../src/svg/Info';
import { UNIT_MEASURES_CONVERTER, calculateQuantity } from '@/utils/units_converter/helper';

const DecreaseQuantityDialog = ({ fetchIngredients, ingredient = {} }) => {
  const [existingIngredientError, setexistingIngredientError] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState(ingredient?.unit?.toLowerCase());
  const [openDecreaseModal, setOpenDecreaseModal] = useState(false);
  const [amountToDecrease, setAmountToDecrease] = useState(null);

  const tooltipText = "Tenga en cuenta que esta acción puede impactar en el stock actual de los productos. Solo debe utilizarse en casos como vencimiento o pérdida de ingrediente. "

  const handleCloseDecreaseModal = () => {
    setOpenDecreaseModal(false);
    setexistingIngredientError('');
    setAmountToDecrease(null);
  };

  useEffect(() => {
    if (getFinalStock() > 0) {
      setexistingIngredientError('');
    }
  }, []);

  const handleDecreaseIngredient = async () => {
    if (getFinalStock() >= 0) {
      try {
        await axios.put(`${getApiUrl()}/ingredient?id=${ingredient?.id_ingredient}`, {
          ingredient: { total_quantity: getFinalStock() },
        });
        fetchIngredients();
        handleCloseDecreaseModal();
      } catch (error) {
        console.error('Error decreasing ingredient:', error);
      }
    } else {
      setexistingIngredientError('No puede restar más stock del disponible.');
    }
  };

  const getFinalStock = () => {
    return ingredient.total_quantity - convertToSelectedUnit(amountToDecrease);
  }

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.match(/^\d{1,10}$/)) {
      setAmountToDecrease(value);
    }
  }

  const convertToSelectedUnit = (amountToConvert) => {
    if (ingredient?.unit !== 'UN' && ingredient?.unit !== 'un') {
      return calculateQuantity(ingredientUnit, amountToConvert)
    }
    return amountToConvert;
  }

  return (
    <>
      <Button
        variant="outlined"
        className="action-button"
        color="primary"
        onClick={() => setOpenDecreaseModal(true)}
        style={{ color: 'white', backgroundColor: 'rgba(216, 130, 130, 0.737)', marginRight: '10px' }}
        startIcon={<ArrowDownwardIcon style={{ color: 'white' }} />}
      >
        Baja de stock manual
      </Button>


      <Dialog open={openDecreaseModal} onClose={handleCloseDecreaseModal}>
        <DialogTitle>{`Registrar baja de stock manual de ${ingredient.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Indique la cantidad que desea dar de baja
            <Tooltip
              title={tooltipText}
              placement="top"
              arrow
              style={{
                backgroundColor: '#E28D8D',
                color: 'white',
                borderRadius: 4,
                fontSize: 25,
                maxWidth: 200,
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                <InfoIcon className="info-icon" />
              </div>
            </Tooltip>
          </DialogContentText>
          <div className="stock-info-container-decrease">
            <div>
              <span className="stock-info-decrease">Stock actual:
                <span style={{ color: 'black', marginLeft: '7px' }}>
                  {ingredient.total_quantity} {ingredient?.unit?.toUpperCase()}
                </span>

              </span>
            </div>
            <div>
              <span className="stock-info-decrease">Stock final actualizado:
                <span style={{ color: getFinalStock() < 0 ? 'red' : 'black', marginLeft: '7px' }}>
                  {getFinalStock()} {ingredient?.unit?.toUpperCase()}
                </span>
              </span>
            </div>
          </div>
          <div className="decrease-container">
            <div className="textfield-decrease-amount-container">
              <TextField
                label="Cantidad a dar de baja"
                type="number"
                inputProps={{ min: 0, max: ingredient.total_quantity }}
                value={amountToDecrease}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                helperText={existingIngredientError}
              />
            </div>
            <div className="textfield-decrease-unit-selector-container">
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
            </div>

          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDecreaseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDecreaseIngredient} color="primary" disabled={getFinalStock() < 0 || amountToDecrease < 1}>
            Dar de baja
          </Button>
        </DialogActions>
      </Dialog >
    </>
  );
};

export default DecreaseQuantityDialog;
