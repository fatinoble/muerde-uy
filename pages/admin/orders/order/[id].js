import axios from 'axios';
import Layout from '../../../../src/components/AdminLayout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container, Grid, List, ListItem, ListItemText, MenuItem, Paper, Select, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { getOrderPaymentMethodName, getOrderStateName } from '@/utils';
import { getApiUrl } from '../../../../services/utils';
import { verifyToken } from '../../../../services/userService';
import CircularProgress from '@mui/material/CircularProgress';

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
    const [loading, setLoading] = useState(true);
    const [selectedState, setSelectedState] = useState('');
    const [fetchedOrderState, setFetchedOrderState] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token_admin');
                const response = await verifyToken(token);
                const user = response.data;
                if (!user.id_user || user.role !== 'ADMIN') {
                    router.push('/admin/login');
                } else {
                    fetchOrder();
                    fetchOrderState();
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();


    }, [])

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/sale`, {
                params: {
                    id: localStorage.getItem('orderId'),
                },
            });
            const data = response.data;
            setOrder(data);
            setFetchedOrderState(data.status);
        } catch (error) {
            console.error('Error fetching sale:', error);
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
            await axios.put(`${getApiUrl()}/sale?id=${order.id_sale}`, {
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

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }
    return (

        <Layout>
            <Container style={{ marginTop: '16px', marginBottom: '16px' }} maxWidth="lg">
                <Button style={{ marginBottom: '20px' }} variant="contained" onClick={(e) => {
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
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Pedido ID: {order?.id_sale}</Typography>
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha de orden realizada: {order?.start_date?.substring(0, 10)}</Typography>
                            {order?.finish_date && <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha finalizado: {order?.finish_date?.substring(0, 10)}</Typography>}
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Nombre usuario: {order?.user ? order?.user?.name : 'Usuario eliminado'}</Typography>
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Mail usuario: {order?.user ? order?.user?.mail : 'Usuario eliminado'}</Typography>
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Tipo de pedido: {order?.delivery_type == 'DELIVERY' ? 'Delivery' : 'Retiro en tienda'}</Typography>
                            {order?.delivery_type == "DELIVERY" && <Typography style={{ marginBottom: '20px' }} variant="h6">Direccion de envio: {order?.user?.address}</Typography>}
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Metodo de pago:
                                {order?.payment_method === "CASH"
                                    ?
                                    <span> {getOrderPaymentMethodName(order?.payment_method)}</span>
                                    :
                                    <span style={{ color: order?.transfer_number === null ? 'red' : 'green' }}> {getOrderPaymentMethodName(order?.payment_method)}
                                        <Tooltip title={order?.transfer_number == null ? "Aún no se realizó la transferencia" : "Nro. transferencia: " + order?.transfer_number}>
                                            <InfoIcon style={{ color: 'rgb(216, 130, 130)' }} />
                                        </Tooltip>
                                    </span>
                                }
                            </Typography>
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Estado:
                                <Select style={{ marginBottom: '20px' }}
                                    value={fetchedOrderState}

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
                                        if ((orderState != 'DONE_DELIVERY' && order?.delivery_type != 'DELIVERY') || (orderState != 'DONE_PICK_UP' && order?.delivery_type != 'PICK_UP')) {
                                            return (
                                                <MenuItem key={orderState} value={orderState} autoFocus={order?.status == orderState} selected={order?.status === orderState}>
                                                    {getOrderStateName(orderState)}
                                                </MenuItem>
                                            );
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