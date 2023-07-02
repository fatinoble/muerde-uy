import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {ArrowDown} from '../../svg'

const UserSettingsMenu = () => {
return(
    <div className="user-settings-menu-container">
      <span className="user-name-container">Pablo Perez</span>
      <ArrowDown className='arrow-icon'/>
      <IconButton className="user-icon">
        <AccountCircle style={{border: '1px solid #FFF', borderRadius: '60px'}}/>
      </IconButton>
    </div>
  );
};

export default UserSettingsMenu;
