import { Modal, Box, Typography, Button } from '@mui/material';

const DeleteModal = ({ open, handleClose, data, handleDelete }) => {
    console.log("data que llega al delete modal receta ", data)
    const renderContent = () => {
        if (data.product != null) {
            return "No se puede eliminar receta porque está asociada al producto " + data.product.title;
        } else {
            return "¿Estás seguro de que quieres eliminar" + data.name + "?";
        }
    };
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
            >
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
                    }}
                >
                    <Typography variant="h5" align="center"
                        sx={{
                            fontWeight: 'bold',
                            color: 'rgb(216, 130, 130)',
                            marginBottom: 2,
                        }}
                    >
                        Eliminar receta
                    </Typography>
                    <Typography variant="h6" component="div">
                        {renderContent()}
                    </Typography>
                    { data.product == null ? (
                        <Button onClick={() => handleDelete(data)}
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
                        >Confirmar
                        </Button>
                    ) : null }
                    <Button onClick={handleClose}
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
                    >Cancelar
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default DeleteModal;