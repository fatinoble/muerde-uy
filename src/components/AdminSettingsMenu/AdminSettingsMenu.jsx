import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToApp  from '@mui/icons-material/ExitToApp';
import BarChart from "@mui/icons-material/BarChart";

const AdminSettingsMenu = () => {
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const localStorageUserName = localStorage.getItem('user_name');
    if (localStorageUserName) {
      setUserName(localStorageUserName);
    }
  }, []); 

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const handleNavigation = (route) => {
    router.push(route);
  };

  return(
    <div className="user-settings-menu-container">
      <span className="user-name-container">{userName}</span>
      <IconButton className="user-icon"  onClick={toggleDropdown}>
        <AccountCircle style={{border: '1px solid #FFF', borderRadius: '60px'}}/>
      </IconButton>
      {dropdownVisible && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => handleNavigation('/admin/reports')}><BarChart /> Dashboard</div>
          <div className="dropdown-item" onClick={() => handleNavigation('/admin/logout')}><ExitToApp /> Logout</div>
        </div>
      )}
    </div>

    
  );
};

export default AdminSettingsMenu;
