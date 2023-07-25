import React, { useState } from 'react';
import { useRouter } from 'next/router';

import {
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
} from "@mui/material";

import Receipt from "@mui/icons-material/Receipt";
import Storefront from "@mui/icons-material/Storefront";
import RestaurantMenu from "@mui/icons-material/RestaurantMenu";
import Kitchen from "@mui/icons-material/Kitchen";
import BarChart from "@mui/icons-material/BarChart";
import People from "@mui/icons-material/People";

const routingList = [
  { name: "Dashboard", icon: <BarChart />, route: "/admin/reports" },
  { name: "Pedidos", icon: <Receipt />, route: "/admin/orders" },
  { name: "Productos", icon: <Storefront />, route: "/admin/products" },
  { name: "Recetas", icon: <RestaurantMenu />, route: "/admin/recipes" },
  { name: "Ingredientes", icon: <Kitchen />, route: "/admin/ingredients" },
  { name: "Clientes", icon: <People />, route: "/admin/clients" },
];

const AdminNavigation = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (route) => {
    setOpen(false);
    router.push(route);
  };

  const getList = () => (
    <div styles={{
      backgroundColor: '#A87658',
      color: '#FDF7E3',
      width: '250px',
      height: '100%',
      paddingTop: '5px',
    }} onClick={() => setOpen(false)}>
      <Typography variant="h6" styles={{
    marginLeft: '5px',
    marginBottom: '5px',
  }}>
        Menú
      </Typography>
      {routingList.map((item, index) => (
        <ListItem
          button
          key={index}
          onClick={() => handleNavigation(item.route)}
          styles={{
            '&:hover': {
              backgroundColor: '#F7DDE8',
              color: '#A87658',
            },
            marginBottom: '5px',
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  );

  return (
    <div>
      <Button 
        className='open-navigation-button'
        variant="contained"
        style={{backgroundColor: "#A87658", color: "#FDF7E3"}}
        onClick={() => setOpen(true)}
      >
        Abrir Menú
      </Button>
      <Drawer open={open} anchor="left" onClose={() => setOpen(false)}>
        {getList()}
      </Drawer>
    </div>
  );
};

export default AdminNavigation;
