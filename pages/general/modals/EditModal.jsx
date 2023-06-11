import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        // Aquí puedes manejar la subida del archivo, por ejemplo, subiéndolo a un servidor o convirtiéndolo a base64.
        // Para el propósito de este ejemplo, simplemente actualizamos el estado de productData con el objeto de archivo.
        setProductData({
            ...productData,
            image: file,
        });
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
                { productData && 
                    <>
                        <TextField variant="outlined" margin="normal" required fullWidth name="title" label="Title" value={productData.title} onChange={handleChange} />
                        <TextField variant="outlined" margin="normal" required fullWidth name="price" label="Price" value={productData.price} onChange={handleChange} />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span">
                                Subir imagen
                            </Button>
                        </label>
                        <TextField variant="outlined" margin="normal" required fullWidth name="description" label="Description" value={productData.description} onChange={handleChange} />
                        <TextField variant="outlined" margin="normal" required fullWidth name="tags" label="Tags" value={productData.tags} onChange={handleChange} />
                        <Select value={productData.catalog?.catalog_id} onChange={handleChange} name="catalog?id">
                            <MenuItem value={"1"}>Catálogo de usuario</MenuItem>
                            <MenuItem value={"2"}>Catálogo de servicios</MenuItem>
                        </Select>
                        <Select value={productData.status} onChange={handleChange} name="status">
                            <MenuItem value={"ENABLED"}>Activo</MenuItem>
                            <MenuItem value={"DISABLED"}>Inactivo</MenuItem>
                            <MenuItem value={"OUT_OF_STOCK"}>Sin stock</MenuItem>
                        </Select>
                    </>
                }
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