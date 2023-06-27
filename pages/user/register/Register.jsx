import React from 'react';
import { useState } from "react";
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { createUser } from '../../../services/userService';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Register = () => {
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleError = (newMessage) => {
        setMessage(newMessage);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (!name || !mail || !address || !phone || !password) {
            handleError("Por favor, completa todos los campos.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(mail)) {
            handleError("Por favor, introduce un correo electrónico válido.");
            return;
        }

        if (!/^\d+$/.test(phone)) {
            handleError("Por favor, introduce un número de teléfono válido.");
            return;
        }

        if (!/(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password)) {
            handleError("La contraseña debe tener al menos 8 caracteres, incluyendo al menos un número y un carácter especial.");
            return;
        }

        const data = {
            name: name,
            mail: mail,
            password: password,
            address: address,
            phone: phone
        };

        try {
            const response = await createUser(data);
            if (response.statusText == "OK") {
                handleError("Usuario creado con éxito, bienvenid@ " + response.data.name + "!");
                //router.push('/algo/algo') ToDo redirigir a catalogo
            } else {
                handleError("Hubo un error al crear la cuenta. Por favor, intenta de nuevo.");
            }
        } catch (error) {
            console.error('Error:', error);
            handleError('Hubo un error al crear la cuenta. Por favor, intenta de nuevo.');
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
                <Typography component="h1" variant="h5" sx={{ color: '#7B3E19' }}>
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
                        onChange={e => setName(e.target.value)}
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
                        onChange={e => setMail(e.target.value)}
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
                        onChange={e => setPassword(e.target.value)}
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
                        onChange={e => setAddress(e.target.value)}
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
                        onChange={e => setPhone(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
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
                        Registrarse
                    </Button>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;