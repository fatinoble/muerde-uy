import { getOrderStateName } from "@/utils";
import { Grid, LinearProgress, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";

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

function OrderCard({ order }) {
    return (
        <Paper style={{ padding: '25px', marginBottom: '25px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography style={{ marginBottom: '20px' }} variant="h5">Pedido Nro: {order?.id_sale}</Typography>
                    <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha del pedido: {order?.start_date?.substring(0, 10)}</Typography>
                    <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha solicitada de entrega: {order?.user_date?.substring(0, 10)}</Typography>
                    {order?.finish_date && <Typography style={{ marginBottom: '20px' }} variant="h6">Fecha Entregado: {order?.finish_date?.substring(0, 10)}</Typography>}
                    <Typography style={{ marginBottom: '20px' }} variant="h6">Tipo de pedido: {order?.delivery_type}</Typography>
                    <Typography style={{ marginBottom: '20px' }} variant="h6"> Estado: {getOrderStateName(order?.status)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h5">Productos de la orden:
                        <List>
                            {order?.products?.map((product) => (
                                <ListItem key={product?.product?.id_product}>
                                    <ListItemText primary={`- x${product?.quantity} ${product?.product?.title} `} />
                                </ListItem>
                            ))}
                        </List>
                    </Typography>

                </Grid>
            </Grid>
            <LinearProgress variant="buffer" value={setProgressBar(order?.status)} valueBuffer={15} />
        </Paper>
    );
}

export default OrderCard;