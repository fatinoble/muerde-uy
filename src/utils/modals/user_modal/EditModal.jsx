import React, { useState, useEffect } from "react";
import { Button, Modal, TextField, Box, Typography } from '@mui/material';

function EditModal({ open, handleClose, user, handleUpdate }) {
    console.log("user que llega al edit modal ", user);
    const [userData, setUserData] = useState(user);

    useEffect(() => {
        setUserData(user);
    }, [user]);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleUpdate(userData);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box onSubmit={handleSubmit}
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
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#f1e5d5', marginBottom: 2 }} >
                    Actualizar usuario
                </Typography>
                <form>
                    <TextField label="Mail" name="mail" fullWidth value={userData.mail} onChange={handleChange}/><br /><br />
                    <TextField label="Dirección" name="address" fullWidth value={userData.address} onChange={handleChange}/><br /><br />
                    <TextField label="Teléfono" name="phone" fullWidth value={userData.phone} onChange={handleChange}/><br /><br />
                    <Button variant="contained" fullWidth color="primary" type='submit' style={{ backgroundColor: 'rgb(168, 118, 88)', color: 'white' }}>
                        Actualizar
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}

export default EditModal;