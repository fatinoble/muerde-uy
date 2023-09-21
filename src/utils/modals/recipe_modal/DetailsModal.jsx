import { OneKPlusOutlined } from '@mui/icons-material';
import { Modal, Box, Typography, Button } from '@mui/material';

const DetailsModal = ({ open, handleClose, data }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxHeight: '85%',
                    overflowY: 'scroll',
                    maxWidth: '500px',
                    bgcolor: 'background.paper',
                    borderRadius: '10px',
                    p: 3,
                    '& .MuiTypography-root': {
                        mb: 2,
                    },
                }}
            >
                <Typography variant="h5" align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: 'rgb(216, 130, 130)',
                        marginBottom: 2,
                    }}
                >
                    Detalle de la receta
                </Typography>
                <Typography variant="body1">
                    <strong>Id: </strong>
                    <span>{data.id_recipe}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Nombre: </strong>
                    <span>{data.name}</span>
                </Typography>
                <Typography variant="body1" style={{ wordWrap: 'break-word', overflowY: 'scroll', maxHeight: '200px', textOverflow: 'ellipsis' }}>
                    <strong>Instrucciones: </strong>
                    <span>{data.instructions}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Tiempo de preparación: </strong>
                    <span>{data.preparationTimeMinutes}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Ingredientes:</strong>
                </Typography>
                <div style={{
                    maxHeight: '300px', overflowY: 'auto', borderTop: '2px dotted rgb(216, 130, 130)',
                    borderBottom: '2px dotted rgb(216, 130, 130)', marginBottom: '20px'
                }}>
                    {data.ingredients.map((ingredient) => (
                        <Typography key={ingredient.ingredient_id} variant="body1">
                            <span>Id: {ingredient.ingredient_id}</span><br />
                            <span>Nombre: {ingredient.name}</span><br />
                            <span>Unidad: {ingredient.unit}</span><br />
                            <span>Costo de última compra: {ingredient.last_purchase_cost}</span><br />
                            <span>Cantidad: {ingredient.quantity}</span><br />
                        </Typography>
                    ))}
                </div>
                {data.product != null ? (
                    <>
                        <Typography variant="body1">
                            <strong>Producto:</strong>
                        </Typography>
                        <Typography variant="body1">
                            <span>Id: {data.product.id_product}</span><br />
                            <span>Nombre: {data.product.title}</span><br />
                            <span>Precio: {data.product.price}</span><br />
                            <span style={{ wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>Descripción: {data.product.description}</span><br />
                            <span>Tags: {data.product.tags}</span><br />
                            <span>Id del catálogo: {data.product.catalog.catalog_id}</span><br />
                            <span>Nombre del catálogo: {data.product.catalog.type}</span><br />
                        </Typography>
                    </>
                ) : null}

                <Button
                    sx={{
                        display: 'block',
                        mt: 2,
                        ml: 'auto',
                        mr: 'auto',
                        backgroundColor: 'rgb(216, 130, 130)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: 'rgb(216, 130, 130)',
                        },
                    }}
                    onClick={handleClose}
                >
                    Cerrar
                </Button>
            </Box>
        </Modal>
    );
}

export default DetailsModal;