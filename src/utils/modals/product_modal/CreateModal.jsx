import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from "react";
import { getAllRecipesWithProducts } from '../../../../services/recipeService';
import { useRouter } from 'next/router';

const CreateModal = ({ open, handleClose, handleAdd }) => {
    const [productData, setProductData] = useState([]);
    const [recipes, setRecipes] = useState({});
    const [imageFileName, setImageFileName] = useState("");
    const [selectedRecipeId, setSelectedRecipeId] = useState('');
    const router = useRouter();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getAllRecipesWithProducts()
            .then(response => {
                setRecipes(response.recipes);
            })
    }, []);

    let filteredRecipes = [];
    if (Array.isArray(recipes)) {
        filteredRecipes = recipes.filter((recipe) => !recipe.product);
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFileName(file.name);
        setProductData({
            ...productData,
            image: file,
        });
    };

    const handleChangeSelectedRecipe = (event) => {
        setSelectedRecipeId(event.target.value);
        const { value } = event.target;
        setProductData((prevData) => ({
            ...prevData,
            recipe_id: value,
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (value !== "" && !validateField(name, value)) {
            return;
        }

        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setProductData({
            ...productData,
            catalog_id: 1,
        });
        handleAdd(productData);
    };

    const validateField = (name, value) => {
        let errorMessage = "";

        switch (name) {
            case "title":
            case "description":
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    errorMessage = "Solo se permiten letras";
                }
                break;
            case "price":
                if (!/^(0(\.\d+)?|[1-9]\d*(\.\d*)?)$/.test(value)) {
                    errorMessage = "Solo se permiten números mayores o iguales que 0 o números con decimales";
                }
                break;
            case "tags":
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,]+$/.test(value)) {
                    errorMessage = "Solo se permiten letras y comas";
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
                <TextField variant="outlined" margin="normal" required fullWidth name="title" label="Title" value={productData.title} onChange={handleChange} helperText={errors.title} />
                <TextField variant="outlined" margin="normal" required fullWidth name="price" label="Price" value={productData.price} onChange={handleChange} helperText={errors.price} />
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
                            backgroundColor: 'rgb(216, 130, 130)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'white',
                                color: 'rgb(216, 130, 130)',
                            },
                        }}
                    >
                        Subir imagen
                    </Button>
                    {imageFileName && <Typography variant="body1">{imageFileName}</Typography>}
                </label>
                <TextField variant="outlined" margin="normal" required fullWidth name="description" label="Description" value={productData.description} onChange={handleChange} helperText={errors.description} />
                <TextField variant="outlined" margin="normal" required fullWidth name="tags" label="Tags" value={productData.tags} onChange={handleChange} helperText={errors.tags} />
                <Select
                    required
                    value={selectedRecipeId}
                    onChange={handleChangeSelectedRecipe}
                    name="recipe_id"
                >
                    <MenuItem value="" disabled>
                        Elija receta
                    </MenuItem>
                    {filteredRecipes.map((recipe) => (
                        <MenuItem key={recipe.id_recipe} value={recipe.id_recipe}>
                            {recipe.name}
                        </MenuItem>
                    ))}
                </Select>
                {selectedRecipeId == "" ?
                    <>
                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'normal', fontSize: '16px' }}>
                            Si la receta no se encuentra en la lista debes crearla para dar de alta el producto
                        </Typography>
                        <Button variant="contained" onClick={() => router.push('/admin/recipes')}
                            sx={{
                                display: 'block',
                                mt: 2,
                                ml: 'auto',
                                mr: 'auto',
                                backgroundColor: 'white',
                                color: 'rgb(216, 130, 130)',
                                '&:hover': {
                                    backgroundColor: 'rgb(216, 130, 130)',
                                    color: 'white',
                                },
                            }}>
                            Crear receta
                        </Button>
                    </>
                    :
                    null
                }
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
                        },
                    }}
                    disabled={isAnyError()}
                >
                    Dar de alta
                </Button>          
            </Box>
        </Modal>
    );
}

export default CreateModal;