import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from "react";

const EditModal = ({ open, handleClose, data, handleUpdate, title }) => {
    const [productData, setProductData] = useState(data || {});

    useEffect(() => {
        setProductData(data);
    }, [data]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleUpdate(productData); // Llamada a la función de actualización
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box component="form" onSubmit={handleSubmit}
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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#f1e5d5', marginBottom: 2}} >
                    {title}
                </Typography>
                {productData && Object.keys(productData).map(key => {
                    if (key !== 'price' && key !== 'id_product' && key !== 'recipe_id') { // ToDo fix price en backend
                        return (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                key={key}
                                name={key}
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                value={productData[key]}
                                onChange={handleChange}
                            />
                        );
                    }
                    return null;
                })}
                <Button type="submit"
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
                >
                    Actualizar producto
                </Button>
            </Box>
        </Modal>
    );
}

export default EditModal;
