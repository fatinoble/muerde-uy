import React from 'react';
import { useState, useRef } from "react";
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { findUserByMail } from '../../../services/userService';
import Popover from '@mui/material/Popover';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/router';

const Login = () => {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const anchorRef = useRef(null);
    const router = useRouter();

    const handleMessage = (newMessage, newMessageType) => {
        setMessage(newMessage);
        setMessageType(newMessageType);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (!mail || !password) {
            handleMessage("Por favor, completa todos los campos.", "error");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(mail)) {
            handleMessage("Por favor, introduce un correo electrónico válido.", "error");
            return;
        }

        if (!/(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password)) {
            handleMessage("La contraseña debe tener al menos 8 caracteres, incluyendo al menos un número y un carácter especial.", "error");
            return;
        }

        const data = {
            mail: mail,
            password: password,
        };

        try {
            const response = await findUserByMail(data);
            if (response.statusText == "OK" && response.data.role == "ADMIN") {
                localStorage.setItem('token login admin', response.data.token);
                localStorage.setItem('user role', response.data.role);
                localStorage.setItem('user name', response.data.name);
                localStorage.setItem('user mail', response.data.mail);
                handleMessage("Login correcto, bienvenid@ " + response.data.name + "!", "success");
                router.push('/admin/reports')
            } else {
                handleMessage("Hubo un error al iniciar sesión. Por favor, intenta de nuevo.", "error");
            }
        } catch (error) {
            console.error('Error:', error);
            handleMessage('Hubo un error al iniciar sesión. Por favor, intenta de nuevo.', "error");
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
                <img src="/images/muerde_logo_small.png" alt="Muerde logo" />
                <Typography component="h1" variant="h5" sx={{ color: '#7B3E19' }}>
                    Ingresar
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                        Ingresar
                    </Button>
                    <Popover
                        open={open}
                        anchorEl={anchorRef.current}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        style={{ transform: 'translateY(10px)' }}
                    >
                        <Alert severity={messageType} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Popover>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;