import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from "react";

const EditModal = ({ open, handleClose, data, dataType, handleUpdate, title }) => {
    const [productData, setProductData] = useState({
        status: 'ENABLED',  // Valor predeterminado si el status es undefined
        ...data,
    });
    const [imageFileName, setImageFileName] = useState("");

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
        handleUpdate(productData);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        // Aquí guardamos el nombre del archivo en el estado separado y en productData.
        setImageFileName(file.name);
        setProductData({
            ...productData,
            image: file.name,
        });
    };

    const renderFieldsToEdit = () => {
        if (dataType === 'product') {
            return (
                <>
                    <TextField variant="outlined" margin="normal" required fullWidth name="title" label="Title" value={productData.title} onChange={handleChange} />
                    <TextField variant="outlined" margin="normal" required fullWidth name="price" label="Price" value={productData.price} onChange={handleChange} />
                    <label htmlFor="raised-button-file">
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <Button variant="contained" component="span">
                            Subir imagen
                        </Button>
                        {imageFileName && <Typography variant="body1">{imageFileName}</Typography>}
                    </label>
                    <TextField variant="outlined" margin="normal" required fullWidth name="description" label="Description" value={productData.description} onChange={handleChange} />
                    <TextField variant="outlined" margin="normal" required fullWidth name="tags" label="Tags" value={productData.tags} onChange={handleChange} />
                    <Select value={productData.catalog?.catalog_id} onChange={handleChange} name="catalog?id">
                        <MenuItem value={"1"}>Catálogo de usuario</MenuItem>
                        <MenuItem value={"2"}>Catálogo de servicios</MenuItem>
                    </Select>
                    <Select value={productData.status || 'ENABLED'} onChange={handleChange} name="status">
                        <MenuItem value={"ENABLED"}>Activo</MenuItem>
                        <MenuItem value={"DISABLED"}>Inactivo</MenuItem>
                        <MenuItem value={"OUT_OF_STOCK"}>Sin stock</MenuItem>
                    </Select>
                </>
            );
        }
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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#f1e5d5', marginBottom: 2 }} >
                    {title}
                </Typography>
                {productData &&
                    renderFieldsToEdit()
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
