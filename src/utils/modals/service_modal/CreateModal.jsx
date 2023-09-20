import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from "react";
import DynamicTags from "../../../components/DynamicTags"

const CreateModal = ({ fetchedServices, open, handleClose, handleAdd }) => {
    const [tags, setTags] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [imageFileName, setImageFileName] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFileName(file.name);
        setServiceData({
            ...serviceData,
            image: file,
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (value !== "" && !validateField(name, value)) {
            return;
        }

        setServiceData({
            ...serviceData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const existService = await validateExistingService(serviceData)
        if (!existService) {
            const finalServiceData = {
                ...serviceData,
                tags: tags?.join(", ") || "",
            }
            setServiceData(finalServiceData);
            handleAdd(finalServiceData);
        }
        else{
            setErrors((prevErrors) => ({
                ...prevErrors,
                title: 'Ya existe un servicio con ese nombre',
            }));
        }
    };
    const validateExistingService = async (newService) => {
        const services = await fetchedServices();
        if (services) {
            const existingService = services.find(serv => serv.title.toLowerCase() === newService.title.toLowerCase());
            return existingService != undefined;
        }
        return false;
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
        return Object.values(errors).some((error) => error !== "") || tags?.length === 0;
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
                <TextField variant="outlined" margin="normal" required fullWidth name="title" label="Title"
                    value={serviceData.title}
                    inputProps={{ maxLength: 50 }}
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
                    value={serviceData.price}
                    onChange={handleChange} 
                    helperText={errors.price} 
                    error={errors.price} 
                    onBlur={() => {
                        if (errors.price !== "") {
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
                        }}>
                        Subir imagen
                    </Button>
                    {imageFileName && <Typography variant="body1">{imageFileName}</Typography>}
                </label>

                <TextField variant="outlined" margin="normal" required fullWidth name="description" label="Description" 
                inputProps={{ maxLength: 150 }} 
                value={serviceData.description} 
                multiline
                rows={2}
                onChange={handleChange} 
                helperText={errors.description} 
                error={errors.description}
                onBlur={() => {
                    if (errors.description !== "") {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            description: "",
                        }))
                    }
                }
                }
                />

                <DynamicTags tags={tags} setTags={setTags} />

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