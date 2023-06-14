import React, { useState, useEffect } from "react";
import { Container, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Box } from '@mui/system';

const unitToGrams = {
    k: 1000,
    g: 1,
    l: 1000,
    oz: 28.3495,
    ml: 1,
    cc: 1,
};

const UnitConverter = ({ initialUnit, initialQuantity, render }) => {
    const [unit, setUnit] = useState(initialUnit);
    const [quantity, setQuantity] = useState(initialQuantity);
    const [result, setResult] = useState(0);

    const handleUnitChange = (event) => {
        setUnit(event.target.value);
        calculateResult(event.target.value, quantity);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
        calculateResult(unit, event.target.value);
    };

    const calculateResult = (unit, quantity) => {
        const resultInGrams = quantity * unitToGrams[unit];
        setResult(resultInGrams);
    };

    useEffect(() => {
        calculateResult(unit, quantity);
    }, [unit, quantity]);

    return (
        render ?
            (
                <Container>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            label="Cantidad"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <Box mt={2}>
                            <InputLabel id="unit-select-label">Unidad</InputLabel>
                        </Box>
                        <Select
                            labelId="unit-select-label"
                            value={unit}
                            onChange={handleUnitChange}
                        >
                            {Object.keys(unitToGrams).map((unitOption) => (
                                <MenuItem key={unitOption} value={unitOption}>
                                    {unitOption}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <p>Equivalente en gramos: {result}</p>
                </Container>
            ) : result
    );
};

export default UnitConverter;

// Como usar el componente: <UnitConverter initialUnit="k" initialQuantity={2} render={true} />