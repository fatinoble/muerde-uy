import axios from 'axios';
import Layout from '../../../src/components/UserLayout';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getOrderStateName, getOrderPaymentMethodName } from '@/utils';
import OrderCard from './components/OrderCard';
import TransferDialog from './components/TransferDialog';
import { setTransferNumber } from '../../../services/saleService';
import { getApiUrl } from '../../../services/utils';
import { verifyToken } from '../../../services/userService';

const Orders = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userId, setUserId] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token_user');
        const response = await verifyToken(token);
        const user = response.data;
        if (!user.id_user) {
          router.push('/user/login');
        }
        setUserId(user.id_user);

        fetchOrders(user.id_user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [])



  const fetchOrders = async (userId) => {
    try {
      const response = await axios.get(`${getApiUrl()}/sale/user?id=${userId}`);
      const data = response.data;
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }

  const showTransferButton = (order) => {
    if (order?.payment_method == 'TRANSFER') {
      if (order?.transfer_number == null) {
        return <Button variant="outlined" size="small" onClick={(e) => {
          e.preventDefault();
          setOrderToEdit(order)
          setTransferModalOpen(true);
        }}>
          Agregar nro. trasferencia
        </Button>
      }
      return <Button variant="outlined" color="secondary" size="small" onClick={(e) => {
        e.preventDefault();
        setOrderToEdit(order)
        setTransferModalOpen(true);
      }}>
        Modificar nro. trasferencia
      </Button>
    }
    return false;
  }

  const newTransferNumber = (newOrderNumberData) => {
    setTransferNumber(newOrderNumberData.id_sale, newOrderNumberData.transfer_number)
      .then(() => {
        handleCloseTransferModal();
        fetchOrders(userId);
      })
  }

  const handleTransferNumberUpdate = (orderId, newTransferNumber) => {
    const updatedOrders = orders.map(order => {
      if (order.id_sale === orderId) {
        return {
          ...order,
          transfer_number: newTransferNumber,
        };
      }
      return order;
    });

    setOrders(updatedOrders); // Update the state with the updated orders
  }

  const handleCloseTransferModal = () => {
    setTransferModalOpen(false);
  };


  const navigateToPage = (id) => {
    router.push(`/user/orders/order/${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //TODO fix pagination style
  //const rows = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <Layout>
      <Head>
        <title>Pedidos</title>
      </Head>
      <div className="user-orders-container">
        <div className="order-cards-container">
          {orders?.filter((order) => order?.status !== 'FINISHED').map((order) => (
            <OrderCard
              key={order.id_sale}
              order={order}
              onTransferNumberUpdate={handleTransferNumberUpdate} />
          ))}
        </div>

        {orders?.length === 0 ?
          <div className='no-orders-container'>
            <div className="centered-content">
              <h1>Todavía no has realizado ningún pedido.</h1>
              <h2>¡Comienza a hacer pedidos ahora!</h2>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  router.push('/product/catalog');
                }}
              >
                Ir al Menú
              </Button>
            </div>
          </div>
          :
          <TableContainer component={Paper} style={{ maxWidth: '500', margin: '0 auto' }}>
            <Table aria-label="My Table">
              <TableHead>
                <TableRow>
                  <TableCell>Nro Pedido</TableCell>
                  <TableCell>Fecha de compra</TableCell>
                  <TableCell>Fecha de entrega</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Tipo de pago</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((order, index) => (
                  <TableRow style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#F0EBEB' }}>
                    <TableCell>{order?.id_sale}</TableCell>
                    <TableCell>{order?.start_date?.substring(0, 10)}</TableCell>
                    <TableCell>{order?.finish_date ? order?.finish_date?.substring(0, 10) : '-'}</TableCell>
                    <TableCell>{getOrderStateName(order?.status)}</TableCell>
                    <TableCell>{getOrderPaymentMethodName(order?.payment_method)}</TableCell>
                    <TableCell>{showTransferButton(order)}</TableCell>
                    <TableCell>
                      <Button
                        style={{ color: 'white', backgroundColor: '#9F605E' }}
                        variant="contained"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToPage(order?.id_sale)
                        }}>
                        Ver detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Pedidos por página"
        /> */}
          </TableContainer>}
      </div>
      {isTransferModalOpen ? (
        <TransferDialog
          open={isTransferModalOpen}
          handleClose={handleCloseTransferModal}
          data={orderToEdit}
          handleAdd={newTransferNumber}
        />
      ) : null}

    </Layout>
  );
};

export default Orders;
