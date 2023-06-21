import { Modal, Box, Typography, Button } from '@mui/material';

const DeleteModal = ({ open, handleClose, data, handleDelete }) => {
    console.log("la data que llega al modal de eliminar es ", data);
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
                            color: '#f1e5d5',
                            marginBottom: 2,
                        }}
                    >
                        "Eliminar producto"
                    </Typography>
                    <Typography variant="h6" component="div">
                        "Estás seguro de que quieres eliminar {data.title}?"
                    </Typography>
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
                    <Button onClick={handleClose}
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
                    >Cancelar
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default DeleteModal;