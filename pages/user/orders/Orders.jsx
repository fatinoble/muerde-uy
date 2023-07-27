import axios from 'axios';
import Layout from '../../../src/components/UserLayout';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getOrderStateName } from '@/utils';
import OrderCard from './components/OrderCard';
const Orders = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    fetchOrders(userId);
  }, [])

  const fetchOrders = async (userId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale/user?id=${userId}`);
      const data = response.data;
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }
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
  const rows = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <Layout>
      <Head>
        <title>Pedidos</title>
      </Head>
      {orders.filter((order) => order?.status !== 'FINISHED').map((order) => (
        <OrderCard order={order} />
      ))}
      <TableContainer component={Paper} style={{ maxWidth: '500', margin: '0 auto' }}>
        <Table aria-label="My Table">
          <TableHead>
            <TableRow>
              <TableCell>Nro Pedido</TableCell>
              <TableCell>Fecha de compra</TableCell>
              <TableCell>Fecha de entrega</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#F0EBEB' }}>
                <TableCell>{order?.id_sale}</TableCell>
                <TableCell>{order?.start_date?.substring(0, 10)}</TableCell>
                <TableCell>{order?.finish_date ? order?.finish_date?.substring(0, 10) : '-'}</TableCell>
                <TableCell>{getOrderStateName(order?.status)}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={(e) => {
                    e.preventDefault();
                    navigateToPage(order?.id_sale)
                  }}>
                    Ver
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
      </TableContainer>
    </Layout>
  );
};

export default Orders;
