import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
import InfoIcon from '../../../../src/svg/Info';
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
  Tooltip,
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
import { formatDate } from '@/utils';

const today = new Date();
const gmtMinus3Offset = 180;
const newDate = new Date(today.getTime() - gmtMinus3Offset * 60 * 1000);
const tomorrow = new Date(newDate);
tomorrow.setDate(newDate.getDate() + 1);

const SaleDialog = ({ product = {}, setNewSale, newSale, setError }) => {
  const [openSaleModal, setOpenSaleModal] = useState(false);
  const [totalOrderPreparationTimePerDay, setTotalOrderPreparationTimePerDay] = useState([]);
  const [maxPreparationTimePerDayMinutesEnabled, setMaxPreparationTimePerDayMinutesEnabled] = useState(10000);
  const [activeStep, setActiveStep] = useState(0);

  const router = useRouter();

  const handleCloseSaleModal = () => {
    setOpenSaleModal(false);
    setActiveStep(0);
    setNewSale(prevSale => ({
      ...prevSale,
      user_date: tomorrow,
      delivery_type: 'PICK_UP'
    }));
  };

  useEffect(() => {
    if (!totalOrderPreparationTimePerDay.length) {
      fetchOrderPreparationInfo();
    }
  }, []);

  const fetchOrderPreparationInfo = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/sale/order_preparation_suggestions`);
      const data = response.data;
      const totalOrderPreparationTimePerDaySet = calculateTotalPreparationTime(data);
      setTotalOrderPreparationTimePerDay(totalOrderPreparationTimePerDaySet);
      setMaxPreparationTimePerDayMinutesEnabled(data?.max_preparation_time_per_day_minutes_enabled);

      const nextAvailableDate = findNextAvailableDate(newSale, getDatesToExclude(totalOrderPreparationTimePerDaySet, data?.max_preparation_time_per_day_minutes_enabled));
      setNewSale(prevSale => ({
        ...prevSale,
        user_date: nextAvailableDate
      }))
    } catch (error) {
      console.error('Error fetching order preparation info:', error);
    }
  };

  const formatDateToCompare = (date) => {
    const currentDate = typeof date === 'string' ? new Date(date) : date;
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const findNextAvailableDate = (sale = {}, excludeDates = []) => {
    let currentDate = new Date(sale.user_date);

    while (true) {
      const formattedDate = formatDateToCompare(currentDate);
      const excludeDateAsUserDate = excludeDates.find(excludeDate => formatDateToCompare(excludeDate) === formattedDate);
      if (!excludeDateAsUserDate) {
        return new Date(
          getUserDateNumbers(formattedDate)[0],
          getUserDateNumbers(formattedDate)[1] - 1,
          getUserDateNumbers(formattedDate)[2]
        ).getTime();

      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  const calculateTotalPreparationTime = (data = {}) => {
    const result = [];

    data.order_preparation_suggestion_per_day.forEach((day) => {
      const totalPreparationTime = day.preparation_suggestions.reduce(
        (sum, suggestion) => sum + suggestion.total_preparation_time_minutes,
        0
      );

      result.push({
        day: day.day,
        total_preparation_time_minutes: totalPreparationTime,
      });
    });

    return result;
  }

  const handleDoSale = async () => {
    try {
      const s = await axios.post(`${getApiUrl()}/sale`, {
        sale: newSale
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

  const getDatesToExclude = (dayOrdersTimePerDay, maxMinConfig) => {
    const datesToExclude = [];

    const totalOrderPreparation = dayOrdersTimePerDay || totalOrderPreparationTimePerDay;
    totalOrderPreparation?.forEach(dayOrders => {
      if (dayOrders.total_preparation_time_minutes > (maxMinConfig || maxPreparationTimePerDayMinutesEnabled)) {
        const dateParts = dayOrders.day?.split('-');
        const transformedDate = dateParts?.join(', ');
        datesToExclude.push(new Date(transformedDate));
      }
    });

    return datesToExclude;
  }

  const getUserDateNumbers = (userDateStr = '') => {
    if (typeof userDateStr !== 'string') {
      return userDateStr;
    }
    return userDateStr.split('-')?.map(part => parseInt(part));
  }

  const getSelectedDate = () => {
    if (typeof newSale.user_date === 'string') {
      return new Date(
        getUserDateNumbers(newSale.user_date)[0],
        getUserDateNumbers(newSale.user_date)[1] - 1,
        getUserDateNumbers(newSale.user_date)[2]
      ).getTime();
    }
    return newSale.user_date;
  }

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
                    <Tooltip
                      title={"Puede que hayan fechas deshabilitadas según la demanda."}
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
                  </div>

                  <div className='date-container-dialog'>
                    <DatePicker
                      selected={getSelectedDate()}
                      minDate={tomorrow}
                      locale={es}
                      excludeDates={getDatesToExclude()}
                      onChange={(date) => {
                        setNewSale(prevSale => ({
                          ...prevSale,
                          user_date: date
                        }))
                      }
                      }
                      placeholderText="Select a date other than today or yesterday"
                      className="date-selector"
                      dateFormat="dd/MM/yyyy"
                    />



                    {/* <TextField
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
                    /> */}
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
