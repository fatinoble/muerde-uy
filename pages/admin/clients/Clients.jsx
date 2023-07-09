import Layout from '../../../src/components/AdminLayout';
import { getUsers } from '../../../services/userService';
import { useEffect } from 'react';
import { styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination, Select, MenuItem } from '@mui/material';
import React, { useState } from "react";

const Clients = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [role, setRole] = React.useState('todos');
  const filteredUsers = role === 'todos' ? users : users.filter(user => user.role === role);

  useEffect(() => {
    getUsers()
      .then(users => {
        setUsers(users.data);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

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
      <Select value={role} onChange={handleRoleChange}>
        <MenuItem value='todos'>Todos</MenuItem>
        <MenuItem value='USER'>Clientes</MenuItem>
        <MenuItem value='ADMIN'>Admins</MenuItem>
      </Select>
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
          {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
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
          <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
            />
          </TableRow>
        </TableFooter>
        </Table>
      </StyledTableContainer>
    </Layout>
  );
};

export default Clients;
