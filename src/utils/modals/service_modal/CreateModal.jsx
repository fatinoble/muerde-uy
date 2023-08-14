import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from "react";

const CreateModal = ({ open, handleClose, handleAdd }) => {
    const [serviceData, setServiceData] = useState([]);
    const [imageFileName, setImageFileName] = useState("");

    useEffect(() => {
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFileName(file.name);
        setServiceData({
            ...serviceData,
            image: file,
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setServiceData({
            ...serviceData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setServiceData({
            ...serviceData,
            catalog_id: 2,
        });
        handleAdd(serviceData);
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
                    <Button variant="contained" component="span"
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
                    }}>
                        Subir imagen
                    </Button>
                    {imageFileName && <Typography variant="body1">{imageFileName}</Typography>}
                </label>
                <TextField variant="outlined" margin="normal" required fullWidth name="description" label="Description" value={serviceData.description} onChange={handleChange} />
                <TextField variant="outlined" margin="normal" required fullWidth name="tags" label="Tags" value={serviceData.tags} onChange={handleChange} />
                
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
                    Dar de alta
                </Button>
            </Box>
        </Modal>
    );
}

export default CreateModal;