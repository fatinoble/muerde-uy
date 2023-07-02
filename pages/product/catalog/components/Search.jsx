import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {SearchIcon} from '../../../../src/svg';

const Search = ({ handleSearchChange, searchQuery }) => {
  return (
      <TextField
      className="search-bar-textfield"
        placeholder="Buscar por título"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        variant="outlined"
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
  );
};

export default Search;
