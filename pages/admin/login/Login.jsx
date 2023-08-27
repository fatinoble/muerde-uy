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

        const data = {
            mail: mail,
            password: password,
        };

        try {
            const response = await findUserByMail(data);
            if (response.data && response.data.role == "ADMIN") {
                localStorage.setItem('token_login_admin', response.data.token);
                localStorage.setItem('user_role', response.data.role);
                localStorage.setItem('user_name', response.data.name);
                localStorage.setItem('user_mail', response.data.mail);
                handleMessage("Login correcto, bienvenid@ " + response.data.name + "!", "success");
                router.push('/admin/reports')
            } else {
                if (response.data.error.status == 404) {
                    handleMessage("No se encontró usuario, por favor verificar mail y contraseña.", "error");
                } else {
                    handleMessage("Contraseña incorrecta, por favor intente nuevamente.", "error");
                }            }
        } catch (error) {
            console.log(`Error Admin - Login.jsx :: `, error);
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