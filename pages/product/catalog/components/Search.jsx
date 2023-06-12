import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FDF7E3',
    },
    secondary: {
      main: '#A87658',
    },
  },
  typography: {
    fontSize: 14,
  }
});

const Search = ({ handleSearchChange, searchQuery }) => {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        label="Buscar por título"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        variant="outlined"
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
          style: {
            fontSize: theme.typography.fontSize,
            borderRadius: '0.5rem',
            color: '#000000',
          },
        }}
        sx={{
          width: '40%',
          backgroundColor: theme.palette.primary.main,
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.secondary.main,
          },
        }}
      />
    </ThemeProvider>
  );
};

export default Search;
