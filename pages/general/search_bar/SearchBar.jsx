import React, { useState, useEffect } from "react";
import Magnifier from '../search_bar/image/magnifier.png';
import { styled } from '@mui/system';
import { TextField, Button } from '@mui/material';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:800/product?q=${searchTerm}`);
            const data = await response.json();
            props.updateSearchResults(data);
        } catch (error) {
            console.error(error);
        }
    }

    const SearchBar = styled(TextField)(({ theme }) => ({
        marginBottom: theme.spacing(2), 
        marginTop: theme.spacing(2), 
        borderRadius: '5px',
        borderColor: 'black',
        backgroundColor: '#ffffff',
        color: 'black',
    }));

    const SearchButton = styled(Button)(({ theme }) => ({
        borderRadius: '10px',
        borderColor: 'black',
        color: 'black',
        '&:hover': {
            backgroundColor: 'beige',
        },
    }));

    return (
        <form className='search-box' onSubmit={handleSearch}>
            <SearchBar
                variant="outlined"
                placeholder='Ingrese producto a buscar'
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
            />
            <SearchButton type="submit">
                <img src={Magnifier}></img>
            </SearchButton>
        </form>
    );

};

export default SearchBar;