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
                    <span>{data.id_service}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Nombre: </strong>
                    <span>{data.title}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Precio: </strong>
                    <span>{data.price}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Foto: </strong>
                    <span>{data.image}</span>
                </Typography>
                <Typography variant="body1">
                    <strong>Descripción: </strong>
                    <span>{data.description}</span>
                </Typography>
                <Typography variant="body1">
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

                <Button
                    sx={{
                        display: 'block',
                        mt: 2,
                        ml: 'auto',
                        mr: 'auto',
                        backgroundColor: '#EDCBA2',
                        color: '#7B3E19',
                        '&:hover': {
                            backgroundColor: '#CCA870',
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