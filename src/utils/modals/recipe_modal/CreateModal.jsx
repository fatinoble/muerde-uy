import { Modal, Box, TextField, InputLabel, FormControl, Button, Typography, Select, MenuItem } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip } from '@mui/material';
import { getAllIngredients } from '../../../../services/ingredientService';
import React, { useState, useEffect } from "react";
import { UNIT_MEASURES_CONVERTER } from '@/utils/units_converter/helper';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

const CreateModal = ({ open, handleClose, handleAdd }) => {
    const [productData, setProductData] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [ingredientQuantities, setIngredientQuantities] = useState({});
    const [searchText, setSearchText] = useState('');
    const [errors, setErrors] = useState({});

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

        if (value !== "" && !validateField(name, value)) {
            return;
        }

        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleQuantityChange = (event, ingredientId) => {
        const quantity = event.target.value;
      
        if (isNaN(quantity) || quantity < 0) {
          return;
        }
      
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

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const validateField = (name, value) => {
        let errorMessage = "";

        switch (name) {
            case "name":
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
                    errorMessage = "Solo se permiten letras";
                }
                break;
            case "instructions":
                if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s]+$/.test(value)) {
                    errorMessage = "Solo se permiten letras y números";
                }
                break;
            case "preparation_time_minutes":
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

    const isAnyQuantity = () => {
        return Object.values(ingredientQuantities).some((ingredient) => ingredient.quantity !== "");
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
                    Alta de receta
                </Typography>
                <TextField variant="outlined" margin="normal" required fullWidth name="name" label="Nombre" value={productData.name} onChange={handleChange} helperText={errors.name} />
                <TextField variant="outlined" margin="normal" required fullWidth name="instructions" label="Instrucciones" value={productData.instructions} onChange={handleChange} helperText={errors.instructions} />
                <TextField variant="outlined" margin="normal" required fullWidth name="preparation_time_minutes" label="Tiempo de preparación en minutos" value={productData.preparation_time} onChange={handleChange} helperText={errors.preparation_time_minutes} />
                <Box
                    component="form"
                    sx={{
                        backgroundColor: '#f1f1f1', 
                        borderRadius: '20px',
                        padding: '0.5rem',
                        marginBottom: '1rem', 
                    }}
                >
                    <InputBase
                        fullWidth 
                        placeholder="Buscar ingrediente"
                        inputProps={{ 'aria-label': 'Buscar ingrediente' }}
                        value={searchText}
                        onChange={handleSearchChange}
                        sx={{
                            ml: 1
                        }}
                        startAdornment={(
                            <SearchIcon color="action" sx={{ mr: 1 }} />
                        )}
                    />
                </Box>
                <TableContainer
                    sx={{
                        maxHeight: '300px',
                        overflow: 'auto'
                    }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ingrediente</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Unidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchText.toLowerCase())).map((ingredient) => {
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
                </TableContainer>
                <Button type="submit"
                    sx={{
                        display: 'block',
                        mt: 2,
                        ml: 'auto',
                        mr: 'auto',
                        backgroundColor: 'rgb(216, 130, 130)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: 'rgb(216, 130, 130)',
                            borderColor: 'rgb(216, 130, 130)',
                        },
                    }}
                    disabled={isAnyError() || !isAnyQuantity()}
                >
                    Dar de alta
                </Button>
            </Box>
        </Modal>
    );

}

export default CreateModal;