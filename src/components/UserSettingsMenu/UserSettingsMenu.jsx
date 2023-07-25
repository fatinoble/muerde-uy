import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {ArrowDown} from '../../svg'

const UserSettingsMenu = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const localStorageUserName = localStorage.getItem('user_name');
    if (localStorageUserName) {
      setUserName(localStorageUserName);
    }
  }, []); 

  return(
    <div className="user-settings-menu-container">
      <span className="user-name-container">{userName}</span>
      <ArrowDown className='arrow-icon'/>
      <IconButton className="user-icon">
        <AccountCircle style={{border: '1px solid #FFF', borderRadius: '60px'}}/>
      </IconButton>
    </div>
  );
};

export default UserSettingsMenu;
