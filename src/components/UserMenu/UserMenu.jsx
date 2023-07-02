import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import { Book, LocalMall, Logout } from '@mui/icons-material';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, ShoppingCart, ExitToApp } from '@mui/icons-material';
import { Cupcacke, ShippingCart, SignOut } from '../../svg';

import './user_menu_styles.css';

const UserMenu = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic
  };

  const handleNavigateTo = (route) => {
    // router.push(route);
    // window.refresh();
    window.location.href = `${window.location.origin}${route}`
  }

  const isCurrentRoute = (route) => {
    return router.pathname.includes(route);
  };

  return (
    <Box p={2}>
      <div className='logo-container'>
        <img src="/images/muerde_pink.png" alt="Logo" style={{ marginBottom: '1rem' }} />
      </div>
      <List>
        <ListItem
          button
          className={isCurrentRoute('product') ? "user-menu-selector-container-selected" : "user-menu-selector-container"}
          onClick={() => handleNavigateTo('/product/catalog')}
        >
          <div className='list-item-content-container'>
            <ListItemIcon>
              <Cupcacke />
            </ListItemIcon>
            <ListItemText primary="Catálogo" className={isCurrentRoute('product') ? "user-menu-selector-selected" : "user-menu-selector"} />
          </div>
        </ListItem >
        <ListItem
          button
          className={isCurrentRoute('orders')  ? "user-menu-selector-container-selected" : "user-menu-selector-container"}
          onClick={() => handleNavigateTo('/user/orders')}
        >
          <div className='list-item-content-container'>
            <ListItemIcon>
              <ShippingCart />
            </ListItemIcon>
            <ListItemText primary="Mis pedidos" className={isCurrentRoute('orders') ? "user-menu-selector-selected" : "user-menu-selector"} />
          </div>
        </ListItem>
        <ListItem button className="user-menu-selector-container" onClick={() => handleLogout()}>
          <div className='list-item-content-container'>
            <ListItemIcon>
              <SignOut />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" className="user-menu-selector" />
          </div>
        </ListItem>
      </List>
    </Box>
  );
};

export default UserMenu;
