import React from 'react';
import axios from 'axios';
import { useState, useRef } from "react";
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
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


    const getTransferNumber = () => {
        return axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/setting`)
            .then(response => {
                return response.data;
            })
            .catch(error => console.error('Error:', error.response.data));
    }

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
            const settingsResponse = await getTransferNumber();
            let transferNumber = '';

            if (settingsResponse && settingsResponse.settings && settingsResponse.settings.length) {
                const setting = settingsResponse.settings.find(setting => setting.key === 'account_number');
                if (setting) {
                    transferNumber = setting.value || '';
                }
            }
            if (response.data && response.data.role == "USER") {
                localStorage.setItem('token_login_user', response.data.token);
                localStorage.setItem('user_id', response.data.id_user);
                localStorage.setItem('user_role', response.data.role);
                localStorage.setItem('user_name', response.data.name);
                localStorage.setItem('user_mail', response.data.mail);
                localStorage.setItem('user_address', response.data.address);
                localStorage.setItem('user_phone', response.data.phone);
                localStorage.setItem('account_number', transferNumber);
                handleMessage("Login correcto, bienvenid@ " + response.data.name + "!", "success");
                router.push('/product/catalog')
            } else {
                if (response.data.error.status == 404) {
                    handleMessage("No se encontró usuario, por favor verificar mail y contraseña.", "error");
                } else {
                    handleMessage("Contraseña incorrecta, por favor intente nuevamente.", "error");
                }
            }
        } catch (error) {
            console.log(`Error - Login.jsx :: `, error);
            handleMessage('Hubo un error al iniciar sesión. Por favor, intenta de nuevo.', "error");
        }
    }

    const handleClick = (e) => {
        e.preventDefault();
        router.push("/user/register");
    };

    return (
        <Grid container direction="row">
            <Grid item xs={6} sx={{ backgroundColor: '#e28d8d' }}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                    >
                        <img src="/images/muerde_logo_small.png" alt="Muerde logo" />
                        <Typography component="h1" variant="h5" sx={{ color: '#fff', fontSize: '60px', textAlign: 'left', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', mt: 'auto' }}>
                            Inicia sesión
                        </Typography>
                        <Typography component="h1" variant="h5" sx={{ color: '#fff', fontSize: '25px', textAlign: 'left', fontFamily: 'Poppins, sans-serif' }}>
                            para comenzar a encargar tortas deliciosas
                        </Typography>
                        <Typography variant="body2" align="left" sx={{ mt: 2, color: '#fff', textAlign: 'left', fontFamily: 'Poppins, sans-serif' }}>
                            ¿Aún no eres cliente? {' '}
                            <a
                                href="/user/register"
                                onClick={handleClick}
                                style={{ cursor: 'pointer', textDecoration: 'none', color: '#A04242', textAlign: 'left', fontFamily: 'Poppins, sans-serif' }}
                            >
                                Regístrate aquí
                            </a>
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                sx={{
                                    backgroundColor: '#D88282',
                                    borderRadius: '13px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'transparent',
                                        },
                                    },
                                    '&:hover': {
                                        boxShadow: '0 0 10px rgba(0,0,0,0.25)',
                                    },
                                }}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="mail"
                                InputProps={{
                                    placeholder: 'Email',
                                    style: { color: '#fff' }
                                }}
                                name="mail"
                                autoComplete="mail"
                                autoFocus
                                onChange={e => setMail(e.target.value)}
                            />
                            <TextField
                                sx={{
                                    backgroundColor: '#D88282',
                                    borderRadius: '13px',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'transparent',
                                        },
                                    },
                                    '&:hover': {
                                        boxShadow: '0 0 10px rgba(0,0,0,0.25)',
                                    },
                                }}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                InputProps={{
                                    placeholder: 'Contraseña',
                                    style: { color: '#fff' }
                                }}
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
                                    height: '50px',
                                    borderRadius: '13px',
                                    display: 'block',
                                    mt: 2,
                                    ml: 'auto',
                                    mr: 'auto',
                                    backgroundColor: '#A95C5C',
                                    color: '#fff',
                                    fontFamily: 'Poppins, sans-serif',
                                    textTransform: 'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#A95C5C',
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
            </Grid>
            <Grid item xs={6}>
                <img src="/images/img_login.svg" alt="Imagen de una torta" style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
            </Grid>
        </Grid>
    );
}

export default Login;