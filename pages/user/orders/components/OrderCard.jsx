import { useState } from "react";
import { getOrderStateName, getOrderPaymentMethodName } from "@/utils";
import { Button, Grid, LinearProgress, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import TransferDialog from "./TransferDialog";
import { useRouter } from 'next/router';
import { setTransferNumber } from "../../../../services/saleService";

const setProgressBar = (status) => {
    if (status == 'TODO') {
        return 0;
    } else if (status == 'WIP') {
        return 40;
    } else if (status == 'DONE_DELIVERY') {
        return 75;
    } else if (status == 'DONE_PICK_UP') {
        return 75;
    } else if (status == 'FINISHED') {
        return 100;
    }

}


function OrderCard({ order, onTransferNumberUpdate }) {
    const router = useRouter();
    const [isTransferModalOpen, setTransferModalOpen] = useState(false);

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
                onTransferNumberUpdate(newOrderNumberData.id_sale, newOrderNumberData.transfer_number);
            })
    }


    return (
        <div className="order-card-container">

            <Paper style={{ marginBottom: '25px' }}>
                <div className="card-header">

                    <Typography variant="h5">
                        Pedido Nro: {order?.id_sale}
                    </Typography>
                </div>
                <div className="content-card-container" style={{ padding: '25px' }}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={6}>

                            <Typography style={{ marginBottom: '20px' }} className="card-title-data" variant="h6">
                                Fecha del pedido: <span className="card-info-data">{order?.start_date?.substring(0, 10)}</span>
                            </Typography>

                            <Typography style={{ marginBottom: '20px' }} className="card-title-data" variant="h6">
                                Fecha solicitada de entrega: <span className="card-info-data">{order?.user_date?.substring(0, 10)}</span>
                            </Typography>

                            {order?.finish_date && <Typography style={{ marginBottom: '20px' }} className="card-title-data" variant="h6">
                                Fecha Entregado: <span className="card-info-data">{order?.finish_date?.substring(0, 10)}</span>
                            </Typography>}

                            <Typography style={{ marginBottom: '20px' }} className="card-title-data" variant="h6">
                                Tipo de entrega: <span className="card-info-data">{order?.delivery_type == 'PICK_UP' ? 'Retiro en tienda' : 'Delivery'}</span>
                            </Typography>

                            <Typography style={{ marginBottom: '20px' }} className="card-title-data" variant="h6">
                                Tipo de pago: <span className="card-info-data">{getOrderPaymentMethodName(order?.payment_method)} {showTransferButton(order)}</span>
                            </Typography>

                            <Typography style={{ marginBottom: '20px' }} className="card-title-data" variant="h6">
                                Estado: <span className="card-info-data">{getOrderStateName(order?.status)}</span>
                            </Typography>

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">Productos de la orden:
                                <List>
                                    {order?.products?.map((product) => (
                                        <ListItem key={product?.product?.id_product}>
                                            <ListItemText primary={`• x${product?.quantity} ${product?.product?.title} `} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Typography>

                        </Grid>
                    </Grid>
                    <LinearProgress variant="buffer" value={setProgressBar(order?.status)} valueBuffer={15} />
                </div>

                {isTransferModalOpen ? (
                    <TransferDialog
                        open={isTransferModalOpen}
                        handleClose={handleCloseTransferModal}
                        data={order}
                        handleAdd={newTransferNumber}
                    />
                ) : null}
            </Paper>
        </div>

    );
}

export default OrderCard;