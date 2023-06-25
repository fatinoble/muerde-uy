import axios from 'axios';
import Layout from '../../../../src/components/AdminLayout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container, Grid, List, ListItem, ListItemText, MenuItem, Paper, Select, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { getOrderStateName } from '@/utils';

function OrderScreen() {

    
  const router = useRouter();

    const { query } = useRouter();
    const orderId = query.id;
    if (orderId != undefined) {
        localStorage.setItem('orderId', orderId);
    }



    const [order, setOrder] = useState({});
    const [ordersState, setOrdersState] = useState([]);
    const [openStateModal, setOpenStateModal] = useState(false);
    const [selectedState, setSelectedState] = useState('');


    useEffect(() => {
        fetchOrder();
        fetchOrderState();
    }, [])

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale`, {
                params: {
                    id: localStorage.getItem('orderId'),
                },
            });
            const data = response.data;
            setOrder(data);
        } catch (error) {
            console.error('Error fetching sale:', error);
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
            await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale?id=${order.id_sale}`, {
                state: selectedState,
            });
            fetchOrder();
        } catch (error) {
            console.error('Error updating state:', error);
        }

        setOpenStateModal(false);
    };

    const handleCancel = () => {
        setOpenStateModal(false);
        setSelectedState('');
    };

    const handleSelectChange = (e) => {
        setSelectedState(e.target.value);
        setOpenStateModal(true);
    };


    return (
        
        <Layout>
            <Container style={{ marginTop: '16px', marginBottom: '16px' }} maxWidth="lg">
            <Button style={{marginBottom: '20px'}}variant="contained" onClick={(e) => {
                        e.preventDefault();
                        router.push(`/admin/orders`);
                      }}>
                        Volver
                      </Button>
                <Paper style={{ padding: '25px' }}>
                    <Typography variant="h3" gutterBottom>
                        Orden Nro. {order?.id_sale}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography style={{marginBottom: '20px'}}variant="h6">Pedido ID: {order?.id_sale}</Typography>
                            <Typography style={{marginBottom: '20px'}}variant="h6">Fecha de orden realizada: {order?.start_date?.substring(0, 10)}</Typography>
                            {order.finish_date && <Typography style={{marginBottom: '20px'}}variant="h6">Fecha finalizado: {order?.finish_date?.substring(0, 10)}</Typography>}
                            <Typography style={{marginBottom: '20px'}}variant="h6">Nombre usuario: {order?.user ? order?.user?.name : 'Usuario eliminado'}</Typography>
                            <Typography style={{marginBottom: '20px'}}variant="h6">Mail usuario: {order?.user ? order.user?.mail : 'Usuario eliminado'}</Typography>
                            <Typography style={{marginBottom: '20px'}}variant="h6">Tipo de pedido: {order?.delivery_type}</Typography>
                            {order.delivery_type == "DELIVERY" && <Typography style={{marginBottom: '20px'}}variant="h6">Direccion de envio: {order?.user?.address}</Typography>}
                            <Typography style={{marginBottom: '20px'}}variant="h6"> Estado:
                                <Select style={{marginBottom: '20px'}}
                                    value={order?.status}

                                    onChange={(e) => {
                                        if (e.target.value != order?.status) {
                                            handleSelectChange(e)
                                        }
                                    }
                                    }
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                >
                                    {ordersState?.map((orderState) => {
                                        if((orderState != 'DONE_DELIVERY' && order.delivery_type != 'DELIVERY') || (orderState != 'DONE_PICK_UP' && order.delivery_type != 'PICK_UP')){
                                            return <MenuItem key={orderState} value={orderState} autoFocus={order.status == orderState} selected={order.status == orderState}>
                                                        {getOrderStateName(orderState)}
                                                    </MenuItem>
                                        }
                                    })}
                                </Select>
                            </Typography>


                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Productos de la orden:
                                <List>
                                    {order?.products?.map((product) => (
                                        <ListItem key={product.product.id_product}>
                                            <ListItemText primary={`- ${product.product.title} - Cantidad: ${product.quantity}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Typography>

                        </Grid>
                    </Grid>
                </Paper>

            </Container>
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
export default OrderScreen;