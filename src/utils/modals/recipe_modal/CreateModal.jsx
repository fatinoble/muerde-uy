import { Modal, Box, TextField, InputLabel, FormControl, Button, Typography, Select, MenuItem } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip } from '@mui/material';
import { getAllIngredients } from '../../../../services/ingredientService';
import React, { useState, useEffect } from "react";
import { UNIT_MEASURES_CONVERTER } from '@/utils/units_converter/helper';

const CreateModal = ({ open, handleClose, handleAdd }) => {
    const [productData, setProductData] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [ingredientQuantities, setIngredientQuantities] = useState({});

    useEffect(() => {
        getAllIngredients()
            .then(response => {
                setIngredients(response.ingredients);
            })
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const transformedIngredients = Object.keys(ingredientQuantities).map((ingredientId) => {
            const ingredient = ingredientQuantities[ingredientId];
            return {
                ingredient_id: ingredientId,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
            };
        });

        const transformedProductData = {
            ...productData,
            ingredients: transformedIngredients,
        };

        handleAdd(transformedProductData);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleQuantityChange = (event, ingredientId) => {
        const quantity = event.target.value;
        setIngredientQuantities(prevState => {
            const updatedIngredient = {
                ...prevState[ingredientId],
                quantity: quantity
            };
            const updatedQuantities = {
                ...prevState,
                [ingredientId]: updatedIngredient
            };
            const updatedIngredients = Object.values(updatedQuantities);
            setProductData(prevData => ({
                ...prevData,
                ingredients: updatedIngredients
            }));
            return updatedQuantities;
        });
    };

    const handleUnitChange = (event, ingredientId) => {
        const unit = event.target.value;
        setIngredientQuantities(prevState => {
            const updatedIngredient = {
                ...prevState[ingredientId],
                unit: unit
            };
            const updatedQuantities = {
                ...prevState,
                [ingredientId]: updatedIngredient
            };
            const updatedIngredients = Object.values(updatedQuantities);
            setProductData(prevData => ({
                ...prevData,
                ingredients: updatedIngredients
            }));
            return updatedQuantities;
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
                    Alta de receta
                </Typography>
                <TextField variant="outlined" margin="normal" required fullWidth name="name" label="Nombre" value={productData.name} onChange={handleChange} />
                <TextField variant="outlined" margin="normal" required fullWidth name="instructions" label="Instrucciones" value={productData.instructions} onChange={handleChange} />
                <TextField variant="outlined" margin="normal" required fullWidth name="preparation_time_minutes" label="Tiempo de preparación en minutos" value={productData.preparation_time} onChange={handleChange} />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ingrediente</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Unidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingredients.map((ingredient) => {
                                const ingredientQuantity = ingredientQuantities[ingredient?.id_ingredient] || {};
                                const { quantity = '', unit = '' } = ingredientQuantity;
                                return (
                                    <TableRow key={ingredient?.id_ingredient}>
                                        <TableCell>{ingredient.name}</TableCell>
                                        <TableCell>
                                            <TextField
                                                value={quantity}
                                                onChange={(event) => handleQuantityChange(event, ingredient?.id_ingredient)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormControl>
                                                <Tooltip title="Todo se guarda en gramos menos las unidades" placement="right">
                                                    <Select
                                                        value={unit}
                                                        onChange={(event) => handleUnitChange(event, ingredient?.id_ingredient)}
                                                    >
                                                        {
                                                            ingredient.unit === 'UN' ?
                                                                <MenuItem value="UN">Unidad/es</MenuItem> :
                                                                UNIT_MEASURES_CONVERTER.map((unitOption) => (
                                                                    <MenuItem key={unitOption.key} value={unitOption.key}>{unitOption.text}</MenuItem>
                                                                ))
                                                        }
                                                    </Select>
                                                </Tooltip>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>            <Button type="submit"
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