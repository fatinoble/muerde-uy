import { Modal, Box, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from "react";
import { getAllRecipesWithProducts } from '../../../services/recipeService';

const DeleteModal = ({ open, handleClose, product, dataType, handleDelete, title }) => {
    console.log("la data que llega al modal de eliminar es ", dataType, product);
    const [recipes, setRecipes] = useState([]);
    const filteredRecipes = recipes?.filter((recipe) => !recipe.product);
    console.log("recipes antes de filtrar: ", recipes);
    console.log("filteredRecipes", filteredRecipes);

    useEffect(() => {
        getAllRecipesWithProducts()
            .then(response => {
                console.log("then recipes with products delete modal", response.recipes);
                setRecipes(response.recipes);
            })

    }, []);

    console.log("rectea actual esta en filtaradas", filteredRecipes.find(recipe => recipe.id_recipe === product?.id_recipe));

    return (
        <>
            {dataType === 'recipe' && !!filteredRecipes.find(recipe => recipe.id_recipe === product?.id_recipe) ? (
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box
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
                        <Typography variant="h5" align="center"
                            sx={{
                                fontWeight: 'bold',
                                color: '#f1e5d5',
                                marginBottom: 2,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography variant="h6" component="div">
                            No se puede eliminar receta porque está asociada al producto {product?.product?.title}, eliminar el producto y luego la receta
                        </Typography>
                        <Button onClick={handleClose}
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
                        >Cancelar
                        </Button>
                    </Box>
                </Modal>) : (
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box
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
                        <Typography variant="h5" align="center"
                            sx={{
                                fontWeight: 'bold',
                                color: '#f1e5d5',
                                marginBottom: 2,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography variant="h6" component="div">
                            ¿Estás seguro de que quieres eliminar {product?.title ? product.title : product?.name}?
                        </Typography>
                        <Button onClick={() => handleDelete(product)}
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
                        >Confirmar
                        </Button>
                        <Button onClick={handleClose}
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
                        >Cancelar
                        </Button>
                    </Box>
                </Modal>
            )}
        </>
    );
}

export default DeleteModal;