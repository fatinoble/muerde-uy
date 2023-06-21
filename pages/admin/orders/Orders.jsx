import axios from 'axios';
import Layout from '../../../src/components/AdminLayout';
import { Button, List, ListItem, ListItemText, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import { getOrderStateName } from '@/utils';

const Orders = () => {

  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [ordersState, setOrdersState] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  useEffect(() => {
    fetchOrders();
    fetchOrderState();
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale`);
      const data = response.data;
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }
  const fetchOrderState = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale/states`);
      const data = response.data;
      setOrdersState(data.available_order_states);
    } catch (error) {
      console.error('Error fetching order states:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale?id=${selectedOrder.id_sale}`, {
        state: selectedState,
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating state:', error);
    }
    setOpenStateModal(false);
  };

  const handleCancel = () => {
    setOpenStateModal(false);
    setSelectedState('');
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



  return (
    <Layout>
      <Head>
        <title>Pedidos</title>
      </Head>
      <h1>Pedidos</h1>
            <TableContainer component={Paper} style={{ maxWidth: '500', margin: '0 auto' }}>
              <Table aria-label="My Table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre cliente</TableCell>
                    <TableCell>Productos</TableCell>
                    <TableCell>Fecha de compra</TableCell>
                    <TableCell>Precio total</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Detalle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((order, index) => (
                    <TableRow style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#F0EBEB' }}>
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
                      <TableCell>${order.total_earn_cost}</TableCell>
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
                          {ordersState.map((orderState) => (
                            <MenuItem key={orderState} value={orderState}>
                              {getOrderStateName(orderState)}
                            </MenuItem>
                          ))}
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
    </Layout>
  );
};

export default Orders;