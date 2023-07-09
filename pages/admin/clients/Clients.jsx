import Layout from '../../../src/components/AdminLayout';
import { getUsers } from '../../../services/userService';
import { useEffect } from 'react';
import { styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from "react";

const Clients = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then(users => {
        setUsers(users.data);
      });
  }, []);

  const StyledTableContainer = styled(TableContainer)({
    backgroundColor: 'white',
    marginTop: '20px',
  });

  const StyledTableCell = styled(TableCell)({
    color: 'brown',
    fontWeight: 'bold',
  });

  return (
    <Layout>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Nombre</StyledTableCell>
              <StyledTableCell>Mail</StyledTableCell>
              <StyledTableCell>Teléfono</StyledTableCell>
              <StyledTableCell>Dirección</StyledTableCell>
              <StyledTableCell>Fecha de registro</StyledTableCell>
              <StyledTableCell>Rol</StyledTableCell>
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
      </StyledTableContainer>
    </Layout>
  );
};

export default Clients;
