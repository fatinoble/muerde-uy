import axios from 'axios';
import Layout from '../../../../src/components/UserLayout';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { Container, Grid, List, ListItem, ListItemText, MenuItem, Paper, Select, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { getOrderPaymentMethodName, getOrderStateName } from '@/utils';
import LinearProgress from '@mui/material/LinearProgress';
import ReviewForm from '@/utils/rating/ReviewForm';
import { getAllReviews, newReview } from '../../../../services/reviewService';
import Popover from '@mui/material/Popover';
import Alert from '@mui/material/Alert';
import SuccessMessage from '../components/SuccessMessage';
import TransferDialog from '../components/TransferDialog';
import { setTransferNumber } from '../../../../services/saleService';
import { getApiUrl } from '../../../../services/utils';
import { verifyToken } from '../../../../services/userService';

const OrderScreen = () => {
    const router = useRouter();
    const orderId = router.query.id;
    const { exito } = router.query;
    const doneSale = router.asPath.includes('exito=true') && exito === 'true';
    const [order, setOrder] = useState({});
    const [isTransferModalOpen, setTransferModalOpen] = useState(false);
    const [orderHasReview, setOrderHasReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(true);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const anchorRef = useRef(null);

    useEffect(() => {
        fetchData();
        const loadReviews = async () => {
            const fetchedReviews = await getAllReviews();
            const reviewExists = fetchedReviews.some(r => r.sale_id === Number(orderId));
            setOrderHasReview(reviewExists);
        };

        loadReviews();
    }, [])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token_user');
            const response = await verifyToken(token);
          const user = response.data;
          if (!user) {
            router.push('/user/login');
          }
          fetchOrder();
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/sale`, {
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
            return 35;
        } else if (status == 'DONE_DELIVERY') {
            return 75;
        } else if (status == 'DONE_PICK_UP') {
            return 75;
        } else if (status == 'FINISHED') {
            return 100;
        }

    }

    const handleReviewSubmit = async (rating, review) => {
        const user_id = localStorage.getItem('user_id');

        if (!orderHasReview) {
            const newReviewData = {
                score: rating,
                description: review,
                userId: Number(user_id),
                saleId: Number(orderId)
            }
            const response = await newReview(newReviewData);
            if (response.status === 200) {
                handleMessage("Gracias por tu reseña!", "success");
                setShowReviewForm(false);
                setOrderHasReview(true);
            } else {
                handleMessage("Hubo un error al enviar tu reseña. Intentalo de nuevo.", "error");
            }
        } else {
            handleMessage("Ya has enviado una reseña para este pedido.", "error");
        }
    };

    const handleMessage = (newMessage, newMessageType) => {
        setMessage(newMessage);
        setMessageType(newMessageType);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const showTransferButton = (order) => {

        if (order?.payment_method == 'TRANSFER') {
            if (order?.transfer_number == null) {
                return <Button variant="outlined" size="small" onClick={(e) => {
                    e.preventDefault();
                    setTransferModalOpen(true);
                }}>
                    Agregar nro. trasferencia
                </Button>
            }
            return <Button variant="outlined" color="secondary" size="small" onClick={(e) => {
                e.preventDefault();
                setTransferModalOpen(true);
            }}>
                Modificar nro. trasferencia
            </Button>
        }
        return false;
    }

    const handleCloseTransferModal = () => {
        setTransferModalOpen(false);
    };

    const newTransferNumber = (newOrderNumberData) => {
        setTransferNumber(newOrderNumberData.id_sale, newOrderNumberData.transfer_number)
            .then(() => {
                handleCloseTransferModal();
                setOrder({ ...order, transfer_number: newOrderNumberData.transfer_number })
            })
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
                    <SuccessMessage message="¡Compra exitosa! Gracias por tu pedido." />
                )}
                <Paper style={{ padding: '25px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography style={{ marginBottom: '20px' }} variant="h5">Pedido Nro: {order?.id_sale}</Typography>
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha del pedido: {order?.start_date?.substring(0, 10)}</Typography>
                            {order.finish_date && <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha Entregado: {order?.finish_date?.substring(0, 10)}</Typography>}
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Tipo de pedido: {order?.delivery_type}</Typography>
                            <Typography style={{ marginBottom: '20px' }} variant="h6">Tipo de pago: {getOrderPaymentMethodName(order?.payment_method)} {showTransferButton(order)}</Typography>
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
                    {(order.status == "FINISHED") && (!orderHasReview && showReviewForm) ? <ReviewForm onSubmit={handleReviewSubmit} /> : null}
                    {orderHasReview ? <Typography style={{ marginBottom: '20px', color: "#A87658", marginTop: '40px', fontSize: '23px' }} variant="h5">¡Gracias por tu reseña!</Typography> : null}
                    <Popover
                        open={open}
                        anchorEl={anchorRef.current}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        style={{ transform: 'translateY(10px)' }}
                    >
                        <Alert severity={messageType} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Popover>

                </Paper>
            </Container>
            {isTransferModalOpen ? (
                <TransferDialog
                    open={isTransferModalOpen}
                    handleClose={handleCloseTransferModal}
                    data={order}
                    handleAdd={newTransferNumber}
                />
            ) : null}
        </Layout >
    );
}

export default OrderScreen;