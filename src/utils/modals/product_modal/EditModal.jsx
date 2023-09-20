import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from "react";
import DynamicTags from "../../../components/DynamicTags";

const EditModal = ({ fetchedProducts, open, handleClose, data = {}, handleUpdate }) => {
    const [tags, setTags] = useState(data.tags?.split(", "));
    const [productData, setProductData] = useState({
        status: 'ENABLED',
        ...data,
    });
    const [imageFileName, setImageFileName] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setProductData(data);
    }, [data]);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        let existProduct = false;
        if(productData.title.toLowerCase() !== data.title.toLowerCase()) {
            existProduct = await validateExistingProduct(productData)
        }
        if (!existProduct) {
            const infoToUpdate = { ...productData, tags: tags?.join(", ") || "", }
            if (infoToUpdate.image === data.image) {
                delete infoToUpdate.image;
            }
            handleUpdate(infoToUpdate);
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                title: 'Ya existe un producto con ese nombre',
            }));
        }

    };

    const validateExistingProduct = async (modifiedProduct) => {
        const products = await fetchedProducts();
        if (products) {
            const existingProduct = products.find(pro => pro.title.toLowerCase() === modifiedProduct.title.toLowerCase());
            return existingProduct != undefined;
        }
        return false;
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFileName(file.name);
        setProductData({
            ...productData,
            image: file,
        });
    };

    const validateField = (name, value) => {
        let errorMessage = "";

        switch (name) {
            case "title":
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    errorMessage = "Solo se permiten letras";
                }
                break;
            case "price":
                if (!/^(0(\.\d+)?|[1-9]\d*(\.\d*)?)$/.test(value)) {
                    errorMessage = "Solo se permiten números mayores o iguales que 0 o números con decimales";
                }
                if (value > 9999999) {
                    errorMessage = "El precio no puede ser mayor a 9999999";
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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: 'rgb(216, 130, 130)', marginBottom: 2 }} >
                    Editar Producto
                </Typography>

                <TextField variant="outlined" margin="normal" required fullWidth name="title" label="Title" 
                inputProps={{ maxLength: 50 }} 
                value={productData.title} 
                onChange={handleChange} 
                helperText={errors.title} 
                error={errors.title} 
                onBlur={() => {
                    if (errors.title !== "") {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            title: "",
                        }))
                    }
                }
                }
                />

                <TextField variant="outlined" margin="normal" required fullWidth name="price" label="Price"
                    onKeyDown={(e) => {
                        if (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+" || e.key === ".") {
                            e.preventDefault()
                        }
                    }}
                    type="number"
                    inputProps={{ min: 1, max: 9999999, step: 1, pattern: "[0-9]*" }}
                    value={productData.price} 
                    onChange={handleChange} 
                    helperText={errors.price} 
                    error={errors.price} 
                    onBlur={() => {
                        if (errors.title !== "") {
                            setErrors((prevErrors) => ({
                                ...prevErrors,
                                price: "",
                            }))
                        }
                    }
                    }
                    />

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
                
                <TextField variant="outlined" margin="normal" required fullWidth name="description" label="Description" 
                inputProps={{ maxLength: 150 }} 
                multiline
                rows={2} 
                value={productData.description} 
                onChange={handleChange} helperText={errors.description} error={errors.description} />

                <DynamicTags tags={tags} setTags={setTags} />
                <Select value={productData.status || 'ENABLED'} onChange={handleChange} name="status">
                    <MenuItem value={"ENABLED"}>Activo</MenuItem>
                    <MenuItem value={"DISABLED"}>Inactivo</MenuItem>
                </Select>
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
                    Actualizar
                </Button>
            </Box>
        </Modal>
    );
}

export default EditModal;
