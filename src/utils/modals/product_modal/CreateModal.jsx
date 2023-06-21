import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from "react";
import { getAllRecipesWithProducts } from '../../../../services/recipeService';
import { getAllCatalogs } from '../../../../services/catalogService';
import { useRouter } from 'next/router';

const CreateModal = ({ open, handleClose, handleAdd }) => {
    const [productData, setProductData] = useState([]);
    const [recipes, setRecipes] = useState({});
    const [catalogs, setCatalogs] = useState([]);
    const [imageFileName, setImageFileName] = useState("");
    const [selectedRecipeId, setSelectedRecipeId] = useState('');
    const [selectedCatalog, setSelectedRecipeIdlectedCatalog] = useState('');
    const router = useRouter();

    useEffect(() => {
        getAllRecipesWithProducts()
            .then(response => {
                console.log("then recipes with products create modal", response.recipes);
                setRecipes(response.recipes);
            })
        getAllCatalogs()
            .then(response => {
                console.log("then catalogs create modal", response.Catalogs);
                setCatalogs(response.Catalogs);
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
            image: file.name,
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

    const handleChangeSelectedCatalog = (event) => {
        setSelectedRecipeIdlectedCatalog(event.target.value);
        const { value } = event.target;
        setProductData((prevData) => ({
            ...prevData,
            catalog_id: value,
        }));
    };

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
                <TextField variant="outlined" margin="normal" required fullWidth name="description" label="Description" value={productData.description} onChange={handleChange} />
                <TextField variant="outlined" margin="normal" required fullWidth name="tags" label="Tags" value={productData.tags} onChange={handleChange} />
                <Select value={selectedCatalog} onChange={handleChangeSelectedCatalog} name="catalog_id">
                    {Array.isArray(catalogs) && catalogs.map((catalog) => (
                        <MenuItem key={catalog.id_catalog} value={catalog.id_catalog}>
                            {catalog.type}
                        </MenuItem>
                    ))}
                </Select>
                <Select required value={selectedRecipeId} onChange={handleChangeSelectedRecipe} name="recipe_id">
                    {filteredRecipes.map((recipe) => (
                        <MenuItem key={recipe.id_recipe} value={recipe.id_recipe}>
                            {recipe.name}
                        </MenuItem>
                    ))}
                </Select>
                <Typography variant="h6" sx={{ mt: 2 }}>Si la receta no se encuentra en la lista debes crearla para dar de alta el producto</Typography>
                <Button variant="contained" onClick={() => router.push('/admin/recipes')}
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
                    Crear receta
                </Button>
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