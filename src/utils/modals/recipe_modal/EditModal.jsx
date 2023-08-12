import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from "react";

const EditModal = ({ open, handleClose, data, handleUpdate }) => {
    const [productData, setProductData] = useState(data);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setProductData(data);
    }, [data]);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleUpdate(productData);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (value !== "" && !validateField(name, value)) {
            return;
        }

        setProductData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleIngredientChange = (event) => {
        const ingredientId = event.target.name; 
        const newQuantity = event.target.value;
    
        setProductData(prevData => ({
            ...prevData, 
            ingredients: prevData.ingredients.map(ingredient =>
                ingredient.ingredient_id === parseInt(ingredientId) ?
                { ...ingredient, quantity: newQuantity } :
                ingredient
            )
        }));
    };

    const validateField = (name, value) => {
        let errorMessage = "";

        switch (name) {
            case "name":
            case "instructions":
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = "Solo se permiten letras";
                }
                break;
            case "preparationTimeMinutes":
                if (!/^[0-9]+$/.test(value)) {
                    errorMessage = "Solo se permiten números";
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));

        return errorMessage === ""; 
    };

    const isAnyError = () => {
        return Object.values(errors).some((error) => error !== "");
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
                    Actualizar receta
                </Typography>
                <TextField variant="outlined" margin="normal" required fullWidth name="name" label="Nombre" value={productData.name} onChange={handleChange} helperText={errors.name}/>
                <TextField variant="outlined" margin="normal" required fullWidth name="instructions" label="Instrucciones" value={productData.instructions} onChange={handleChange} helperText={errors.instructions} />
                <TextField variant="outlined" margin="normal" required fullWidth name="preparationTimeMinutes" label="Tiempo de preparación" value={productData.preparationTimeMinutes} onChange={handleChange} helperText={errors.preparationTimeMinutes}/><br /><br /><br />
                <Typography variant="body1">
                    <strong>Ingredientes:</strong>
                </Typography><br />
                {productData.ingredients.map((ingredient) => (
                    <div key={ingredient.ingredient_id}>
                        <Typography variant="body1">{ingredient.name}</Typography>
                        <Typography variant="body1">
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name={ingredient.ingredient_id} 
                                label="Cantidad"
                                value={ingredient.quantity} 
                                onChange={handleIngredientChange} 
                            />
                        </Typography>
                    </div>
                ))}
                <Button type="submit" style={{ backgroundColor: 'rgb(168, 118, 88)', color: 'white' }} disabled={isAnyError()}>
                    Actualizar
                </Button>
            </Box>
        </Modal>
    );
}

export default EditModal;