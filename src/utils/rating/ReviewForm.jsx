import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function ReviewForm({ onSubmit }) {
  const [value, setValue] = useState(2);
  const [review, setReview] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(value, review);
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} 
      sx={{
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px', 
        alignItems: 'center'
      }}>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
      <TextField
        label="Reseña"
        value={review}
        onChange={(event) => {
          setReview(event.target.value);
        }}
        multiline
        rows={4}
        variant="outlined"
      />
      <Button type="submit" variant="contained" style={{ backgroundColor: "#A87658" }}>Guardar reseña</Button>
    </Box>
  );
}