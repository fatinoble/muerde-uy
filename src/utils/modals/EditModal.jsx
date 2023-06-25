import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from "react";

const EditModal = ({ open, handleClose, data, dataType, handleUpdate, title }) => {
    console.log("entra a edit modal receta ", data);
    const [productData, setProductData] = useState({
        status: 'ENABLED',
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
        setImageFileName(file.name);
        setProductData({
            ...productData,
            image: file.name,
        });
    };

    const renderFieldsToEdit = () => {
        if (dataType === 'product') {
            return renderProductFields();
        } else if (dataType === 'recipe') {
            return renderRecipeFields();
        }	
    };

    const renderProductFields = () => {
        return !open ? null :
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
    };

    const renderRecipeFields = () => {
        return !open ? null :
        <>
            <TextField variant="outlined" margin="normal" required fullWidth name="name" label="Nombre" value={productData.name} onChange={handleChange} />
            <TextField variant="outlined" margin="normal" required fullWidth name="instructions" label="Instrucciones" value={productData.instructions} onChange={handleChange} />
            <TextField variant="outlined" margin="normal" required fullWidth name="preparation-time" label="Tiempo de preparación" value={productData.preparationTimeMinutes} onChange={handleChange} />
            <Typography variant="body1">
                <strong>Ingredientes:</strong>
            </Typography>
            {productData.ingredients.map((ingredient) => (        
                <div key={ingredient.ingredient_id}>
                <Typography variant="body1">{ingredient.name}</Typography>
                <Typography variant="body1">
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="quantity"
                    label="Cantidad"
                    value={ingredient.quantity}
                    onChange={handleChange}
                  />
                </Typography>
              </div>
            ))}
        </>
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
                    Actualizar
                </Button>
            </Box>
        </Modal>
    );
}

export default EditModal;
