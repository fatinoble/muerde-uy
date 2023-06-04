import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '500px',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  padding: theme.spacing(2, 4, 3),
  '& .MuiTypography-root': {
    marginBottom: theme.spacing(2),
  },
}));

const CloseButton = styled(Button)(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(2),
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: '#EDCBA2', // Cambia a tu color de elección
  color: '#7B3E19', // Cambia a tu color de elección
  '&:hover': {
    backgroundColor: '#CCA870', // Cambia a tu color de elección
  },
}));

function DetailsModal({ open, handleClose, data }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <ModalContent>
        {data && Object.keys(data).map(key => {
          if (key !== 'price') { // Hasta solucionar el problema del precio en el back
            return (
              <Typography variant="body1" key={key}>
                <strong>{key}: </strong>
                <span>{data[key]}</span>
              </Typography>
            );
          }
          return null; // Asegúrate de devolver null en caso de que la clave sea 'price'
        })}
        <CloseButton onClick={handleClose}>
          Cerrar
        </CloseButton>
      </ModalContent>
    </Modal>
  );
}

export default DetailsModal;