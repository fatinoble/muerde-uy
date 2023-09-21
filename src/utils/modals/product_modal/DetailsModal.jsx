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
                    maxWidth: '500px',
                    bgcolor: 'background.paper',
                    borderRadius: '10px',
                    p: 3,
                    '& .MuiTypography-root': {
                        mb: 2,
                    },
                }}
            >
                <Typography variant="body1">
                    <strong>Id: </strong>
                    <span>{data.id_product}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Nombre: </strong>
                    <span>{data.title}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Precio: </strong>
                    <span>{data.price}</span>
                </Typography>
                <Typography variant="body1" style={{ wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <strong>Descripción: </strong>
                    <span>{data.description}</span>
                </Typography>
                <Typography variant="body1" >
                    <strong>Tags: </strong>
                    <span>{data.tags}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Tipo de catálogo: </strong>
                    <span>{data.catalog.catalog_id}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Nombre del catálogo: </strong>
                    <span>{data.catalog.type}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>ID de Receta: </strong>
                    <span>{data.recipe.id_recipe}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Nombre de la receta: </strong>
                    <span>{data.recipe.name}</span>
                </Typography>
                <Typography variant="body1" style={{ wordWrap: 'break-word', overflowY: 'scroll', maxHeight: '200px', textOverflow: 'ellipsis' }}>
                    <strong>Instrucciones de la receta: </strong>
                    <span>{data.recipe.instructions}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Tiempo de preparación de la receta: </strong>
                    <span>{data.recipe.preparation_time_minutes}</span>
                </Typography>

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