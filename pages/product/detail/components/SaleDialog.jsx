import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, RadioGroup, FormControlLabel, Radio } from '@mui/material';

// TODO manejar con logica de usuario
const user = { user_id: 1 };

const SaleDialog = ({ product = {}, quantity }) => {
  const [openSaleModal, setOpenSaleModal] = useState(false);

  const router = useRouter();

  const defaultSale = {
    delivery_type: 'PICK_UP',
    user_id: user.user_id,
    products: [
      {
        product_id: product.id_product,
        quantity: quantity
      }
    ]
  };

  const [newSale, setNewSale] = useState(defaultSale);

  const handleCloseSaleModal = () => {
    setOpenSaleModal(false);
    setNewSale(defaultSale);
  };

  const handleDoSale = async () => {
    try {
      const s = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale`, {
        sale: newSale,
      });
      router.push(`/user/orders/order/${s.data.id_sale}?exito=true`);
      // TODO tiempo estimado de preparación
    } catch (error) {
      console.log(error)
      console.error('Error doing sale:', error);
    }
  };

  const handleDeliveryTypeChange = (event) => {
    setNewSale({ ...newSale, delivery_type: event.target.value });
  };

  return (
    <>
      <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={()=>setOpenSaleModal(true)} disabled={product.is_out_of_stock}>
        Comprar
      </Button>

      <Dialog open={openSaleModal} onClose={handleCloseSaleModal}>
        <DialogTitle>Comprar {product.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Seleccione el método de entrega:
          </DialogContentText>
          <RadioGroup value={newSale.delivery_type} onChange={handleDeliveryTypeChange}>
            <FormControlLabel value="PICK_UP" control={<Radio />} label="Recoger en local" />
            <FormControlLabel value="DELIVERY" control={<Radio />} label="Envío a domicilio" />
          </RadioGroup>
        </DialogContent>
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
