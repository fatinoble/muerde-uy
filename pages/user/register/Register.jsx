import React from 'react';
import { useState } from "react";
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { createUser } from '../../../services/userService';

const Register = () => {
    const handleSubmit = async event => {
        event.preventDefault();
        const data = {
            name: event.target.name.value,
            mail: event.target.mail.value,
            password: event.target.password.value,
            address: event.target.address.value,
            phone: event.target.phone.value
        };

        try {
            const response = await createUser(data);
            if (response.statusText == "OK") {
                alert("Usuario creado con éxito, bienvenid@ " + response.data.name + "!");
                //router.push('/algo/algo') ToDo redirigir a catalogo
            } else {
                alert("Hubo un error al crear la cuenta. Por favor, intenta de nuevo.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al crear la cuenta. Por favor, intenta de nuevo.');
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box 
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Registrarse
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nombre"
                        name="name"
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="mail"
                        label="Correo Electrónico"
                        name="mail"
                        autoComplete="mail"
                        autoFocus
                    />                    
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="address"
                        label="Dirección"
                        name="address"
                        autoComplete="address"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label="Teléfono"
                        name="phone"
                        autoComplete="phone"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Registrarse
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;