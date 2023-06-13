
import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import React, { useState } from "react";

const CreateModal = ({ open, handleClose, handleAdd, title }) => {
    const [productData, setProductData] = useState({});
    const [imageFileName, setImageFileName] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleAdd(productData);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFileName(file.name);
        setProductData({
            ...productData,
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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#f1e5d5', marginBottom: 2}} >
                    {title}
                </Typography>
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
                <TextField variant="outlined" margin="normal" required fullWidth name="catalog_id" label="Catalog ID" value={productData.catalog_id} onChange={handleChange} />
                <Select value={productData.recipe_id} onChange={handleChange} name="recipe_id">
                    <MenuItem value={"1"}>1</MenuItem>
                </Select>                
                <Select value={productData.status} onChange={handleChange} name="status">
                    <MenuItem value={"ENABLED"}>ENABLED</MenuItem>
                    <MenuItem value={"DISABLED"}>DISABLED</MenuItem>
                    <MenuItem value={"OUT_OF_STOCK"}>OUT OF STOCK</MenuItem>
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
                    Dar de alta
                </Button>
            </Box>
        </Modal>
    );
}

export default CreateModal;
