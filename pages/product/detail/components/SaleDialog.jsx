import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, RadioGroup, FormControlLabel, Radio, Grid, TextField } from '@mui/material';

const today = new Date();
const gmtMinus3Offset = 180;
const newDate = new Date(today.getTime() - gmtMinus3Offset * 60 * 1000);
const tomorrow = new Date(newDate);
tomorrow.setDate(newDate.getDate() + 1);

const SaleDialog = ({ product = {}, setNewSale, newSale, setError }) => {
  const [openSaleModal, setOpenSaleModal] = useState(false);

  const router = useRouter();

  const handleCloseSaleModal = () => {
    setOpenSaleModal(false);
    setNewSale(prevSale => ({
      ...prevSale,
      delivery_type: 'PICK_UP'
    }));
  };

  const handleDoSale = async () => {
    try {
      const s = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale`, {
        sale: newSale,
      });
      router.push(`/user/orders/order/${s.data.id_sale}?exito=true`);
    } catch (error) {
      console.error('Error doing sale:', error);
      if (error.response.status === 409) {
        setError("No hay suficiente stock para la cantidad solicitada. Prueba con menor cantidad.")
      } else {
        setError("Algo salió mal")
      }
    }
  };

  const handleDeliveryTypeChange = (event) => {
    setNewSale(prevSale => ({
      ...prevSale,
      delivery_type: event.target.value
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setNewSale(prevSale => ({
      ...prevSale,
      payment_method: event.target.value
    }));
  };
  const handleDateChange = (event) => {
    setNewSale(prevSale => ({
      ...prevSale,
      user_date: event.target.value
    }));
  };

  const handleOpenSaleModal = () => {
    if(!localStorage.getItem('user_id')){
      router.push('/user/login');
      return;
    }
    setOpenSaleModal(true);
  };

  return (
    <>
      <Button variant="contained" color="primary" className="product-detail-buy-button" onClick={() => handleOpenSaleModal()} disabled={product.is_out_of_stock}>
        Comprar
      </Button>

      <Dialog open={openSaleModal} onClose={handleCloseSaleModal}>
        <DialogTitle>Comprar {product.title}</DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>



            <DialogContent>
              <DialogContentText>
                Seleccione el método de entrega:
              </DialogContentText>
              <RadioGroup value={newSale?.delivery_type} onChange={handleDeliveryTypeChange}>
                <FormControlLabel value="PICK_UP" control={<Radio />} label="Recoger en local" />
                <FormControlLabel value="DELIVERY" control={<Radio />} label="Envío a domicilio" />
              </RadioGroup>
            </DialogContent>

          </Grid>
          <Grid item xs={12} sm={6}>



            <DialogContent>
              <DialogContentText>
                Seleccione fecha entrega:
              </DialogContentText>
              <TextField
                id="date"
                type="date"
                onChange={handleDateChange}
                defaultValue={tomorrow.toISOString().split('T')[0]}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: tomorrow.toISOString().split('T')[0],
                }}
              />
            </DialogContent>

          </Grid>
          <Grid item xs={12} sm={12}>
            <DialogContent>
              <DialogContentText>
                Seleccione el método de pago:
              </DialogContentText>
              <RadioGroup value={newSale?.payment_method} onChange={handlePaymentMethodChange}>
                <FormControlLabel value="CASH" control={<Radio />} label="Efectivo" />
                <FormControlLabel value="TRANSFER" control={<Radio />} label="Transferencia bancaria" />
              </RadioGroup>
            </DialogContent>
            </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={handleCloseSaleModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDoSale} color="primary">
            Confirmar compra
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaleDialog;
