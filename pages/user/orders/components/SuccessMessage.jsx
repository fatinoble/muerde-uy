import { Paper, Typography } from '@mui/material';

const styles = {
  successMessage: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '8px', // You can adjust the padding as needed
    borderRadius: '4px', // You can adjust the border radius as needed
    marginBottom: '16px', // You can adjust the margin as needed
  },
};

function SuccessMessage( {message} ) {

  return (
    <Paper style={styles.successMessage}>
      <Typography variant="body1">
        {message}
      </Typography>
    </Paper>
  );
}

export default SuccessMessage;