import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from "react";

const EditModal = ({ open, handleClose, data, handleUpdate }) => {
    const [serviceData, setServiceData] = useState({
        status: 'ENABLED',
        ...data,
    });
    const [imageFileName, setImageFileName] = useState("");

    useEffect(() => {
        setServiceData(data);
    }, [data]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setServiceData({
            ...serviceData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleUpdate(serviceData);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFileName(file.name);
        setServiceData({
            ...serviceData,
            image: file.name,
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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#f1e5d5', marginBottom: 2 }} >
                    Editar Servicio
                </Typography>
                <TextField variant="outlined" margin="normal" required fullWidth name="title" label="Title" value={serviceData.title} onChange={handleChange} />
                <TextField variant="outlined" margin="normal" required fullWidth name="price" label="Price" value={serviceData.price} onChange={handleChange} />
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
                <TextField variant="outlined" margin="normal" required fullWidth name="description" label="Description" value={serviceData.description} onChange={handleChange} />
                <TextField variant="outlined" margin="normal" required fullWidth name="tags" label="Tags" value={serviceData.tags} onChange={handleChange} />
                <Select value={serviceData.catalog?.catalog_id} onChange={handleChange} name="catalog?id">
                    <MenuItem value={"1"}>Catálogo de usuario</MenuItem>
                    <MenuItem value={"2"}>Catálogo de servicios</MenuItem>
                </Select>
                <Select value={serviceData.status || 'ENABLED'} onChange={handleChange} name="status">
                    <MenuItem value={"ENABLED"}>Activo</MenuItem>
                    <MenuItem value={"DISABLED"}>Inactivo</MenuItem>
                </Select>
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