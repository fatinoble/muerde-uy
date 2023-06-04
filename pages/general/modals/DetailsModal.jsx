import { Modal, Box, Typography, Button } from '@mui/material';

const ProductModal = ({ open, handleClose, data, title }) => {
  return (
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
          '& .MuiTypography-root': {
            mb: 2,
          },
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#f1e5d5',
            marginBottom: 2,
          }}
        >
          {title}
        </Typography>
        {data && Object.keys(data).map(key => {
          if (key !== 'price') {
            return (
              <Typography variant="body1" key={key}>
                <strong>{key}: </strong>
                <span>{data[key]}</span>
              </Typography>
            );
          }
          return null;
        })}
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

export default ProductModal;
