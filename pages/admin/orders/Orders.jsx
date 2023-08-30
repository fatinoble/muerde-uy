import axios from 'axios';
import Layout from '../../../src/components/AdminLayout';
import OrderPreparation from './components/OrderPreparation';
import Receipt from "@mui/icons-material/Receipt";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getOrderPaymentMethodName, getOrderStateName } from '@/utils';
import CalendarOrders from '../reports/components/CalendarOrders';
import { getApiUrl } from '../../../services/utils';

const Orders = () => {

  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [ordersState, setOrdersState] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  useEffect(() => {
    fetchOrders();
    fetchOrderState();
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/sale`);
      const data = response.data;
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }
  const fetchOrderState = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/sale/states`);
      const data = response.data;
      setOrdersState(data.available_order_states);
    } catch (error) {
      console.error('Error fetching order states:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      if (selectedOrder.payment_method == 'TRANSFER' && selectedOrder.transfer_number == null) {
        setOpenPaymentModal(true);
        return;
      }
      await axios.put(`${getApiUrl()}/sale?id=${selectedOrder.id_sale}`, {
        state: selectedState,
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating state:', error);
    }
    setOpenStateModal(false);
  };

  const handleConfirmPayment = async () => {
    try {
      await axios.put(`${getApiUrl()}/sale?id=${selectedOrder.id_sale}`, {
        state: selectedState,
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating state:', error);
    }
    setOpenPaymentModal(false);
    setOpenStateModal(false);
  };

  const handleCancel = () => {
    setOpenStateModal(false);
    setSelectedState('');
  };

  const handleCancelPayment = () => {
    setOpenPaymentModal(false);
  };

  const handleSelectChange = (e, order) => {
    setSelectedOrder(order);
    setSelectedState(e.target.value);
    setOpenStateModal(true);
  };

  const navigateToPage = (id) => {
    router.push(`/admin/orders/order/${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rows = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getDaysDifference = (date) => {
    const today = new Date();
    const userDate = new Date(date);
    const timeDiff = userDate.getTime() - today.getTime();
    if (timeDiff < 0) {
      return -Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));
    }
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getCellColor = (date) => {
    const daysDifference = getDaysDifference(date);
    if (daysDifference <= 7 && daysDifference > 2) {
      return '#FFA500';
    } else if (daysDifference <= 2) {
      return '#FF0000';
    } else {
      return '#008000';
    }
  };


  return (
    <Layout>
      <Head style={{ marginBottom: '10px' }}>
        <title>Pedidos</title>
      </Head>
      <div className="title-container">
        <h1><Receipt className="icon-title" />Pedidos</h1>
      </div>
      <OrderPreparation />
      <div style={{ margin: '20px 0' }}>
        <CalendarOrders />

      </div>
      <TableContainer component={Paper} style={{ maxWidth: '500', margin: '0 auto' }}>
        <Table aria-label="My Table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre cliente</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Fecha de compra</TableCell>
              <TableCell>Fecha de entrega solicitada</TableCell>
              <TableCell>Precio total</TableCell>
              <TableCell>Metodo de pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Detalle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((order, index) => (
              <TableRow key={order.id_sale} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#F0EBEB' }}>
                <TableCell>{order.id_sale}</TableCell>
                <TableCell>{order.user ? order.user.name : 'Usuario eliminado'}</TableCell>
                <TableCell>
                  <List>
                    {order.products.map((product) => (
                      <ListItem key={product.product.id_product}>
                        <ListItemText primary={`${product.product.title} (${product.quantity})`} />
                      </ListItem>
                    ))}
                  </List>
                </TableCell>
                <TableCell>{order.start_date.substring(0, 10)}</TableCell>
                {order.status == 'FINISHED' ? <TableCell>{order.user_date.substring(0, 10)}</TableCell>
                  : <TableCell style={{ color: getCellColor(order.user_date) }}>{order.user_date.substring(0, 10)}</TableCell>}
                <TableCell>${order.total_earn_cost}</TableCell>
                {order.payment_method === "CASH"
                  ?
                  <TableCell>{getOrderPaymentMethodName(order.payment_method)}</TableCell>
                  :
                  <TableCell style={{ color: order.transfer_number === null ? 'red' : 'green' }}>{getOrderPaymentMethodName(order.payment_method)}
                    <Tooltip title={order.transfer_number == null ? "Aún no se realizó la transferencia" : "Nro. transferencia: " + order.transfer_number}>
                      <InfoIcon style={{ color: 'rgb(216, 130, 130)' }} />
                    </Tooltip>
                  </TableCell>
                }
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => {
                      if (e.target.value != order.status) {
                        handleSelectChange(e, order);
                      }
                    }
                    }
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  >
                    {ordersState.map((orderState) => {
                      if ((orderState != 'DONE_DELIVERY' && order.delivery_type != 'DELIVERY') || (orderState != 'DONE_PICK_UP' && order.delivery_type != 'PICK_UP')) {
                        return <MenuItem key={orderState} value={orderState} autoFocus={order.status == orderState}>
                          {getOrderStateName(orderState)}
                        </MenuItem>
                      }
                    })}
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={(e) => {
                    e.preventDefault();
                    navigateToPage(order.id_sale)
                  }}>
                    Detalles
                  </Button>
                </TableCell>
              </TableRow>


            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Pedidos por página"
      />
      {
        openStateModal && (
          <Dialog
            open={openStateModal}
            onClose={() => setOpenStateModal(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirmar Estado</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ¿Estás segurx de que deseas cambiar el estado?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} color="primary">
                No
              </Button>
              <Button onClick={handleConfirm} color="primary" autoFocus>
                Sí
              </Button>
            </DialogActions>
          </Dialog>
        )
      }

      {
        openPaymentModal && (
          <Dialog
            open={openPaymentModal}
            onClose={() => setOpenPaymentModal(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Pago transferencia</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Esta compra fue realizada con pago por transferencia y aun no se ha ingresado el número de transferencia. ¿Desea cambiar el estado de todos modos?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelPayment} color="primary">
                No
              </Button>
              <Button onClick={handleConfirmPayment} color="primary" autoFocus>
                Sí
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </Layout>
  );
};

export default Orders;