import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from "react";

const EditModal = ({ open, handleClose, data, data_type, handleUpdate, title }) => {
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

    const renderContent = () => {
        if (data_type === 'product') {
            return renderProductContent();
        }
    }

    const renderProductContent = () => {
        return (
            <>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="title"
                    label="Título"
                    value={title}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="price"
                    label="Precio"
                    value={price}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="image"
                    label="Imagen"
                    value={image}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="description"
                    label="Descripción"
                    value={description}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="tags"
                    label="Tags"
                    value={tags}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="catalog_id"
                    label="ID de Catálogo"
                    value={catalog_id}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="status"
                    label="Estado"
                    value={status}
                    onChange={handleChange}
                />
            </>
        );
    }

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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#f1e5d5', marginBottom: 2 }} >
                    {title}
                </Typography>
                {renderContent()}
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
                    Actualizar
                </Button>
            </Box>
        </Modal>
    );
}

export default EditModal;
