import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import { Book, LocalMall, Logout } from '@mui/icons-material';

import './user_menu_styles.css';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (route) => {
    setAnchorEl(null);
    router.push(route);
  };

  const handleLogout = () => {
    // Handle logout logic
  };

  const renderMenu = () => {
    return (
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleClose('/product/catalog')}>
          <Book style={{ marginRight: '8px', color: '#F7DDE8' }} />
          Catálogo
        </MenuItem>
        <MenuItem onClick={() => handleClose('/user/orders')}>
          <LocalMall style={{ marginRight: '8px', color: '#B7C6A8' }} />
          Mis pedidos
        </MenuItem>
        <MenuItem onClick={() => handleLogout()}>
          <Logout style={{ marginRight: '8px', color: '#FF3B30' }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>
    );
  };

  return (
    <div className="user-menu-container">
      <span className="user-name-container">Pablo Perez</span>
      <IconButton onClick={handleClick} className="user-icon">
        <AccountCircle />
      </IconButton>
      {renderMenu()}
    </div>
  );
};

export default UserMenu;
