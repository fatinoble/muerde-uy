import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToApp  from '@mui/icons-material/ExitToApp';
import ShoppingCart  from '@mui/icons-material/ShoppingCart';

const UserSettingsMenu = () => {
  const [userName, setUserName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [logOutModal, setLogOutModal] = useState(false);
  const router = useRouter();
  const isLoggedIn = !!userName;

  useEffect(() => {
    const localStorageUserName = localStorage.getItem('user_name');
    if (localStorageUserName) {
      setUserName(localStorageUserName);
    }
  }, []); 


  const handleLogout = () => {
    localStorage.clear();
    router.push('/user/login');
  };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const handleNavigation = (route) => {
    router.push(route);
    toggleDropdown();
  };

  return (
    <div className="user-settings-menu-container">
      {isLoggedIn && <span className="user-name-container">{userName}</span>}
      {!isLoggedIn && <span className="user-name-container-login"  onClick={() => handleNavigation('/user/login')}>Log In</span>}
      
      <IconButton className="user-icon" onClick={toggleDropdown}>
        <AccountCircle style={{ border: '1px solid #FFF', borderRadius: '60px' }} />
      </IconButton>
      {dropdownVisible && (
        <div className="dropdown-menu">
          {isLoggedIn && (
            <>
              <div className="dropdown-item" onClick={() => handleNavigation('/user/orders')}><ShoppingCart /> Mis pedidos</div>
              <div className="dropdown-item" onClick={() => setLogOutModal(true)}><ExitToApp /> Logout</div>
            </>
          )}
          {!isLoggedIn && (
            <div className="dropdown-item" onClick={() => handleNavigation('/user/login')}><ExitToApp /> Login</div>
          )}
        </div>
      )}

{
        logOutModal && (
          <Dialog
            open={logOutModal}
            onClose={() => setLogOutModal(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">¿Está seguro que desea cerrar sesión?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setLogOutModal(false)} color="primary">
                No
              </Button>
              <Button onClick={() => handleLogout()} color="primary" autoFocus>
                Sí
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </div>
  );
};

export default UserSettingsMenu;
