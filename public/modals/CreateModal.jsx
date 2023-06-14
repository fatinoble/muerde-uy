
import { Modal, Box, TextField, InputLabel, FormControl, Button, Typography, Select, MenuItem } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { getAllIngredients } from '../../services/ingredientService';
import React, { useState, useEffect } from "react";

const CreateModal = ({ open, handleClose, handleAdd, data_type, title }) => {
    const [productData, setProductData] = useState({});
    const [imageFileName, setImageFileName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [ingredientQuantities, setIngredientQuantities] = useState({});
    const unitOptions = ['k', 'g', 'l', 'oz', 'ml', 'cc', 'unidad'];

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


    const handleQuantityChange = (event, ingredientId) => {
        const { value } = event.target;
        setIngredientQuantities((prevQuantities) => ({
          ...prevQuantities,
          [ingredientId]: {
            ...prevQuantities[ingredientId],
            quantity: value
          }
        }));
      };
      
      const handleUnitChange = (event, ingredientId) => {
        const { value } = event.target;
        setIngredientQuantities((prevQuantities) => ({
          ...prevQuantities,
          [ingredientId]: {
            ...prevQuantities[ingredientId],
            unit: value
          }
        }));
    };

    const renderContent = () => {
        if (data_type === 'product') {
            return renderProductContent();
        } else if (data_type === 'recipe') {
            return renderRecipeContent();
        }
    };

    const renderProductContent = () => {
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
                <TextField variant="outlined" margin="normal" required fullWidth name="catalog_id" label="Catalog ID" value={productData.catalog_id} onChange={handleChange} />
                <Select value={productData.recipe_id} onChange={handleChange} name="recipe_id">
                    <MenuItem value={"1"}>1</MenuItem>
                </Select>
                <Select value={productData.status} onChange={handleChange} name="status">
                    <MenuItem value={"ENABLED"}>ENABLED</MenuItem>
                    <MenuItem value={"DISABLED"}>DISABLED</MenuItem>
                    <MenuItem value={"OUT_OF_STOCK"}>OUT OF STOCK</MenuItem>
                </Select>
            </>
        );
    }

    const renderRecipeContent = () => {
        console.log("los ingredientes ", ingredients);
        return (
          <>
            <TextField variant="outlined" margin="normal" required fullWidth name="name" label="Nombre" value={productData.name} onChange={handleChange} />
            <TextField variant="outlined" margin="normal" required fullWidth name="instructions" label="Instrucciones" value={productData.instructions} onChange={handleChange} />
            <TextField variant="outlined" margin="normal" required fullWidth name="prepTime" label="Tiempo de preparación en minutos" value={productData.preparation_time} onChange={handleChange} />
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
                    const ingredientQuantity = ingredientQuantities[ingredient.id] || {};
                    const { quantity = '', unit = '' } = ingredientQuantity;
      
                    return (
                      <TableRow key={ingredient.id}>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>
                          <TextField
                            value={quantity}
                            onChange={(event) => handleQuantityChange(event, ingredient.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl>
                            <InputLabel>Unidad</InputLabel>
                            <Select
                              value={unit}
                              onChange={(event) => handleUnitChange(event, ingredient.id)}
                            >
                              {unitOptions.map((unitOption) => (
                                <MenuItem key={unitOption} value={unitOption}>{unitOption}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );
    };

    useEffect(() => {
        getAllIngredients()
            .then(response => {
                console.log("then ingredients create modal", response.ingredients);
                setIngredients(response.ingredients);
            })
    }, []);


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
                {renderContent()}
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
