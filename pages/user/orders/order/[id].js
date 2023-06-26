import axios from 'axios';
import Layout from '../../../../src/components/UserLayout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, List, ListItem, ListItemText, MenuItem, Paper, Select, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { getOrderStateName } from '@/utils';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
    successMessage: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
}));

function OrderScreen() {
    const router = useRouter();
    const orderId = router.query.id;

    const classes = useStyles();

    const { exito } = router.query;
    const doneSale = router.asPath.includes('exito=true') && exito === 'true';

    const [order, setOrder] = useState({});


    useEffect(() => {
        fetchOrder();
    }, [])



    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale`, {
                params: {
                    id: orderId,
                },
            });
            const data = response.data;
            setOrder(data);
        } catch (error) {
            console.error('Error fetching sale:', error);
        }
    }
    const setProgressBar = (status) => {
        if (status == 'TODO') {
            return 0;
        } else if (status == 'WIP') {
            return 40;
        } else if (status == 'DONE_DELIVERY') {
            return 100;
        } else if (status == 'DONE_PICK_UP') {
            return 100;
        }

    }


    return (
        <Layout>
            <h1>Pedido Nro {orderId}</h1>
            <Container style={{ marginTop: '16px', marginBottom: '16px' }} maxWidth="lg">
                <Button style={{ marginBottom: '20px' }} variant="contained" onClick={(e) => {
                    e.preventDefault();
                    router.push(`/user/orders`);
                }}>
                    Volver
                </Button>
                {doneSale === true && (
                    <Paper className={classes.successMessage}>
                        <Typography variant="body1">
                            ¡Compra exitosa! Gracias por tu pedido.
                        </Typography>
                    </Paper>)}
                <Paper style={{ padding: '25px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography style={{ marginBottom: '20px' }} variant="h5">Pedido Nro: {order?.id_sale}</Typography>
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha del pedido: {order?.start_date?.substring(0, 10)}</Typography>
                            {order.finish_date && <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha Entregado: {order?.finish_date?.substring(0, 10)}</Typography>}
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Tipo de pedido: {order?.delivery_type}</Typography>
                            <Typography style={{ marginBottom: '20px' }} variant="h6"> Estado: {getOrderStateName(order?.status)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Productos de la orden:
                                <List>
                                    {order?.products?.map((product) => (
                                        <ListItem key={product.product.id_product}>
                                            <ListItemText primary={`- x${product.quantity} ${product.product.title} `} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Typography>

                        </Grid>
                    </Grid>
                    <LinearProgress variant="buffer" value={setProgressBar(order?.status)} valueBuffer={15} />
                </Paper>

            </Container>
        </Layout>
    );
}

export default OrderScreen;