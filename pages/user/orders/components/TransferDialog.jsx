import { Modal, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

const TransferDialog = ({ open, handleClose, data, handleAdd }) => {
    const [orderData, setOrderData] = useState([]);
    const router = useRouter();
    const [error, setError] = useState({});

    useEffect(() => {
        setOrderData(data);
    }, [data]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (value !== "" && !validateField(name, value)) {
            return;
        }

        setOrderData({
            ...orderData,
            name: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleAdd(orderData);
    };

    const validateField = (name, value) => {
        let errorMessage = "";
        if (name === "transfer_number" && !/^\d+$/.test(value)) {
            errorMessage = "Solo se permiten números.";
        }

        setError((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));

        return errorMessage === "";
    };

    const isAnyError = () => {
        return Object.values(error).some((error) => error !== "");
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
                <TextField variant="outlined" margin="normal" label="Numero de cuenta" disabled value={localStorage.getItem("bank_number")} />
                <TextField variant="outlined" margin="normal" required fullWidth name="transfer_number" label="Numero de trasferencia" value={orderData?.transfer_number} onChange={handleChange} helperText={error.transfer_number} />

                <Button type="submit" variant="contained" sx={{
                    display: 'block',
                    mt: 2,
                    ml: 'auto',
                    mr: 'auto',
                }}
                    disabled={isAnyError()}
                >
                    Guardar
                </Button>
            </Box>
        </Modal>
    );
}

export default TransferDialog;