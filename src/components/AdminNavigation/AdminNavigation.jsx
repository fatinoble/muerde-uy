import React, { useState } from 'react';
import { useRouter } from 'next/router';

import {
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  Receipt,
  Storefront,
  RestaurantMenu,
  Kitchen,
  BarChart,
  People
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  drawer: {
    backgroundColor: '#A87658',
    color: '#FDF7E3',
    width: 250,
    height: '100%',
    paddingTop: theme.spacing(2),
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#F7DDE8',
      color: '#A87658',
    },
    marginBottom: theme.spacing(1),
  },
  title: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(2),
  },
}));

const routingList = [
  { name: "Pedidos", icon: <Receipt />, route: "/admin/orders" },
  { name: "Productos", icon: <Storefront />, route: "/admin/products" },
  { name: "Recetas", icon: <RestaurantMenu />, route: "/admin/recipes" },
  { name: "Ingredientes", icon: <Kitchen />, route: "/admin/ingredients" },
  { name: "Reportes", icon: <BarChart />, route: "/admin/reports" },
  { name: "Clientes", icon: <People />, route: "/admin/clients" },
];

const AdminNavigation = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const classes = useStyles();

  const handleNavigation = (route) => {
    setOpen(false);
    router.push(route);
  };

  const getList = () => (
    <div className={classes.drawer} onClick={() => setOpen(false)}>
      <Typography variant="h6" className={classes.title}>
        Menú
      </Typography>
      {routingList.map((item, index) => (
        <ListItem
          button
          key={index}
          onClick={() => handleNavigation(item.route)}
          className={classes.listItem}
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
