import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from "react";

const EditModal = ({ fetchedRecipes, open, handleClose, data, handleUpdate }) => {
    const [productData, setProductData] = useState(data);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setProductData(data);
    }, [data]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const existRecipe = await validateExistingRecipe(productData)
        if (!existRecipe) {
            handleUpdate(productData);
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Ya existe una receta con ese nombre',
            }));
        }
    };

    const validateExistingRecipe = async (modifiedRecipe) => {
        const recipes = await fetchedRecipes();
        if (recipes) {
            const existingRecipe = recipes.find(rec => rec.name.toLowerCase() === modifiedRecipe.name.toLowerCase());
            return existingRecipe != undefined;
        }
        return false;
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

        if (newQuantity !== "" && !/^((\.\d+)?|[1-9]\d*(\.\d*)?)$/.test(newQuantity)) {
            return;
        }
    
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
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
                    errorMessage = "Solo se permiten letras";
                }
                break;
            case "preparationTimeMinutes":
                if (!/^(0|[1-9]\d*)$/.test(value)) {
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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: 'rgb(216, 130, 130)', marginBottom: 2 }} >
                    Actualizar receta
                </Typography>
                <TextField variant="outlined" margin="normal" required fullWidth name="name" label="Nombre" value={productData.name} onChange={handleChange}  inputProps={{ maxLength: 50 }} helperText={errors.name}  error={errors.name} />
                <TextField variant="outlined" margin="normal" required fullWidth name="instructions" label="Instrucciones" value={productData.instructions}  inputProps={{ maxLength: 800 }} onChange={handleChange} helperText={errors.instructions} />
                <TextField variant="outlined" margin="normal" required fullWidth name="preparationTimeMinutes" label="Tiempo de preparación" 
                type='number'
                inputProps={{ min: 1, max: 999, step: 1, pattern: "[0-9]*" }} 
                value={productData.preparationTimeMinutes} 
                onChange={handleChange} 
                helperText={errors.preparationTimeMinutes}/>
                
                <br /><br /><br />
                <Typography variant="body1">
                    <strong>Ingredientes:</strong>
                </Typography><br />
                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {productData.ingredients.map((ingredient) => (
                        <div key={ingredient.ingredient_id}>
                            <Typography variant="body1">{ingredient.name}</Typography>
                            <Typography variant="body1">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    inputProps={{ min: 1, step: 0.01 }}
                                    name={ingredient.ingredient_id} 
                                    label="Cantidad"
                                    value={ingredient.quantity} 
                                    onChange={handleIngredientChange} 
                                />
                            </Typography>
                        </div>
                    ))}
                </div>
                <Button type="submit" style={{ backgroundColor: 'rgb(216, 130, 130)', color: 'white' }} disabled={isAnyError()}>
                    Actualizar
                </Button>
            </Box>
        </Modal>
    );
}

export default EditModal;