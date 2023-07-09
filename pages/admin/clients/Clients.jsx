import Layout from '../../../src/components/AdminLayout';
import { getUsers } from '../../../services/userService';
import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from "react";

const Clients = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then(users => {
        setUsers(users.data);
      });
  }, []);

  console.log(users);

  return (
    <Layout>
    <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Mail</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell>Dirección</TableCell>
          <TableCell>Fecha de registro</TableCell>
          <TableCell>Rol</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id_user}>
            <TableCell>{user.id_user}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.mail}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>{user.address}</TableCell>
            <TableCell>{user.creation_date}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
     </Layout>
  );
};

export default Clients;
