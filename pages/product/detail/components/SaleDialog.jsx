import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getApiUrl } from '../../../../services/utils';
import { RadioButtonCheckedRounded } from '@mui/icons-material';

const today = new Date();
const gmtMinus3Offset = 180;
const newDate = new Date(today.getTime() - gmtMinus3Offset * 60 * 1000);
const tomorrow = new Date(newDate);
tomorrow.setDate(newDate.getDate() + 1);

const SaleDialog = ({ product = {}, setNewSale, newSale, setError }) => {
  const [openSaleModal, setOpenSaleModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const router = useRouter();

  const handleCloseSaleModal = () => {
    setOpenSaleModal(false);
    setActiveStep(0);
    setNewSale(prevSale => ({
      ...prevSale,
      delivery_type: 'PICK_UP'
    }));
  };

  const handleDoSale = async () => {
    try {
      const s = await axios.post(`${getApiUrl()}/sale`, {
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
    if (!localStorage.getItem('user_id')) {
      router.push('/user/login');
      return;
    }
    setOpenSaleModal(true);
  };

  const steps = [
    'Método de entrega',
    'Fecha de entrega',
    'Método de pago',
  ];

  return (
    <>
      <Button variant="contained" color="primary" className="product-detail-buy-button" onClick={() => handleOpenSaleModal()} disabled={product.is_out_of_stock}>
        Comprar
      </Button>

      <Dialog open={openSaleModal} onClose={handleCloseSaleModal}>
        <div className="dialog-sale-container">
          <div className="dialog-sale-header-container">
            <DialogTitle className="dialog-title-buy">Comprar {product.title}</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleCloseSaleModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>



          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>


          <Grid >

            {activeStep === 0 && (
              <Grid >
                <DialogContent className="dialog-content">
                  <div className='image-dialog'>
                    <img src='/images/ilustration-cake-1.png' />
                  </div>
                  <div className='dialog-text-title-container'>
                    <DialogContentText className="dialog-text-title">
                      Selecciona el método de entrega:
                    </DialogContentText>
                  </div>
                  <div className='radio-group-dialog'>
                    <RadioGroup value={newSale?.delivery_type} onChange={handleDeliveryTypeChange}>
                      <FormControlLabel
                        value="PICK_UP"
                        control={<Radio />}
                        label="Recoger en local"
                        className={newSale?.delivery_type === "PICK_UP" ? "radio-group-label-checked" : "radio-group-label"} />

                      <FormControlLabel
                        value="DELIVERY"
                        control={<Radio />}
                        label="Envío a domicilio"
                        className={newSale?.delivery_type === "DELIVERY" ? "radio-group-label-checked" : "radio-group-label"}
                      />
                    </RadioGroup>
                  </div>
                </DialogContent>

              </Grid>
            )}


            {activeStep === 1 && (
              <Grid >

                <DialogContent className="dialog-content">
                  <div className='image-dialog'>
                    <img src='/images/ilustration-cake-2.png' />
                  </div>
                  <div className='dialog-text-title-container'>
                    <DialogContentText className="dialog-text-title" >
                      Seleccione fecha entrega:
                    </DialogContentText>
                  </div>
                  <div className='date-container-dialog'>
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
                      className="date-selector"
                    />
                  </div>
                </DialogContent>

              </Grid>
            )}


            {activeStep === 2 && (
              <Grid >
                <DialogContent className="dialog-content">
                  <div className='image-dialog'>
                    <img src='/images/ilustration-cake-3.png' style={{ width: "274px", height: "236px" }} />
                  </div>
                  <div className='dialog-text-title-container'>
                    <DialogContentText className="dialog-text-title">
                      Seleccione el método de pago:
                    </DialogContentText>
                  </div>
                  <div className='radio-group-dialog'>
                    <RadioGroup value={newSale?.payment_method} onChange={handlePaymentMethodChange}>
                      <FormControlLabel
                        value="CASH"
                        control={<Radio />}
                        label="Efectivo"
                        className={newSale?.payment_method === "CASH" ? "radio-group-label-checked" : "radio-group-label"}
                      />

                      <FormControlLabel
                        value="TRANSFER"
                        control={<Radio />}
                        label="Transferencia bancaria"
                        className={newSale?.payment_method === "TRANSFER" ? "radio-group-label-checked" : "radio-group-label"}
                      />
                    </RadioGroup>
                  </div>
                </DialogContent>
              </Grid>
            )}


          </Grid>
          <DialogActions className="advance-step-container">

            <Button
              disabled={activeStep < 1}
              onClick={() => {
                setActiveStep((prevActiveStep) => (
                  prevActiveStep - 1
                ))
              }} color="primary">
              <ArrowBackIosIcon></ArrowBackIosIcon>
            </Button>

            {activeStep < 2 && (
              <Button
                onClick={() => {
                  setActiveStep((prevActiveStep) => (
                    prevActiveStep + 1
                  ))
                }} color="primary">
                <ArrowForwardIosIcon></ArrowForwardIosIcon>
              </Button>
            )}



            {activeStep === 2 && (
              <Button onClick={handleDoSale} className="confirm-sale-button">
                Confirmar compra
              </Button>
            )}

          </DialogActions>

        </div>
      </Dialog >
    </>
  );
};

export default SaleDialog;
